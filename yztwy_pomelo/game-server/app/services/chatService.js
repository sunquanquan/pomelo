var Code = require('../../../shared/code');
var utils = require('../util/utils');
var dispatcher = require('../util/dispatcher');
var Event = require('../consts/consts').Event;

var ChatService = function(app) {
  this.app = app;
  this.uidMap = {};
  this.nameMap = {};
  this.channelMap = {};
};

module.exports = ChatService;

/**
 * Add player into the channel
 *
 * @param {String} uid         user id
 * @param {String} playerName  player's role name
 * @param {String} channelName channel name
 * @return {Number} see code.js
 */
ChatService.prototype.add = function(gameID, playerName, channelName) {
  var sid = getSidByUid(gameID, this.app);
  if(!sid) {
    return Code.CHAT.FA_UNKNOWN_CONNECTOR;
  }

  if(checkDuplicate(this, gameID, channelName)) {
    return Code.OK;
  }

  utils.myPrint('channelName = ', channelName);
  var channel = this.app.get('channelService').getChannel(channelName, true);
  if(!channel) {
    return Code.CHAT.FA_CHANNEL_CREATE;
  }

  channel.add(gameID, sid);
  addRecord(this, gameID, playerName, sid, channelName);

  return Code.OK;
};

/**
 * User leaves the channel
 *
 * @param  {String} uid         user id
 * @param  {String} channelName channel name
 */
ChatService.prototype.leave = function(gameID, channelName) {
  var record = this.uidMap[gameID];
  var channel = this.app.get('channelService').getChannel(channelName, true);

  if(channel && record) {
    channel.leave(gameID, record.sid);
  }

  removeRecord(this, gameID, channelName);
};

/**
 * Kick user from chat service.
 * This operation would remove the user from all channels and
 * clear all the records of the user.
 *
 * @param  {String} uid user id
 */
ChatService.prototype.kick = function(gameID) {
  var channelNames = this.channelMap[gameID];
  var record = this.uidMap[gameID];

  if(channelNames && record) {
    // remove user from channels
    var channel;
    for(var name in channelNames) {
      channel = this.app.get('channelService').getChannel(name);
      if(channel) {
        channel.leave(gameID, record.sid);
      }
    }
  }

  clearRecords(this, gameID);
};

/**
 * Push message by the specified channel
 *
 * @param  {String}   channelName channel name
 * @param  {Object}   msg         message json object
 * @param  {Function} cb          callback function
 */
ChatService.prototype.pushByChannel = function(channelName, msg, cb) {
  var channel = this.app.get('channelService').getChannel(channelName);
  if(!channel) {
    cb(new Error('channel ' + channelName + ' dose not exist'));
    return;
  }

  channel.pushMessage(Event.chat, msg, cb);
};

/**
 * Push message to the specified player
 *
 * @param  {String}   playerName player's role name
 * @param  {Object}   msg        message json object
 * @param  {Function} cb         callback
 */
ChatService.prototype.pushByPlayerName = function(playerName, msg, cb) {
  var record = this.nameMap[playerName];
  if(!record) {
    cb(null, Code.CHAT.FA_USER_NOT_ONLINE);
    return;
  }

  this.app.get('channelService').pushMessageByUids(Event.chat, msg, [{gameID: record.gameID, sid: record.sid}], cb);
};

/**
 * Cehck whether the user has already in the channel
 */
var checkDuplicate = function(service, gameID, channelName) {
  return !!service.channelMap[gameID] && !!service.channelMap[gameID][channelName];
};

/**
 * Add records for the specified user
 */
var addRecord = function(service, gameID, name, sid, channelName) {
  var record = {gameID: gameID, name: name, sid: sid};
  service.uidMap[gameID] = record;
  service.nameMap[name] = record;
  var item = service.channelMap[gameID];
  if(!item) {
    item = service.channelMap[gameID] = {};
  }
  item[channelName] = 1;
};

/**
 * Remove records for the specified user and channel pair
 */
var removeRecord = function(service, gameID, channelName) {
  delete service.channelMap[gameID][channelName];
  if(utils.size(service.channelMap[gameID])) {
    return;
  }

  // if user not in any channel then clear his records
  clearRecords(service, gameID);
};

/**
 * Clear all records of the user
 */
var clearRecords = function(service, gameID) {
  delete service.channelMap[gameID];

  var record = service.uidMap[gameID];
  if(!record) {
    return;
  }

  delete service.uidMap[gameID];
  delete service.nameMap[record.name];
};

/**
 * Get the connector server id assosiated with the uid
 */
var getSidByUid = function(gameID, app) {
  var connector = dispatcher.dispatch(gameID, app.getServersByType('connector'));
  if(connector) {
    return connector.id;
  }
  return null;
};
