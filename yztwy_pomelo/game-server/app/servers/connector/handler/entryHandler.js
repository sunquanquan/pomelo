var Code = require('../../../../../shared/code');
var userDao = require('../../../dao/userDao');
var async = require('async');
var channelUtil = require('../../../util/channelUtil');
var utils = require('../../../util/utils');
var logger = require('pomelo-logger').getLogger(__filename);

module.exports = function (app) {
    return new Handler(app);
};


var Handler = function (app) {
    this.app = app;

    if (!this.app)
        logger.error(app);
};

var handler = Handler.prototype;

/**
 * New client entry game server. Check token and bind user info into session.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
handler.entry = function (msg, session, next) {
    console.log('entryHandler...................');
    var channelService = this.app.get('channelService');
    var token = msg.token;
    var userID = msg.uid;
    var self = this;
    if (!token || msg.token == undefined) {
        next(new Error('invalid entry request: empty token'), {code: Code.FAIL, msg: "empty token"});
        return;
    }
    if (!userID || msg.uid == undefined) {
        next(null, {code: Code.GATE.FA_NO_USERID});
        return;
    }
    var gameID, userData;

    async.waterfall([
        function (cb) {
            // auth token
            self.app.rpc.auth.authRemote.auth(session, token, cb);
        }, function (code, user, cb) {
            // query userData info by user id
            if (code !== Code.OK) {
                next(null, {code: code});
                return;
            }
            if (!user) {
                next(null, {code: Code.ENTRY.FA_USER_NOT_EXIST});
                return;
            }
            if (user.gameID != userID) {
                next(null, {code: Code.ENTRY.FA_USER_ILLEGAL});
                return;
            }
            gameID = user.gameID;
            userData = user;
            self.app.get('sessionService').kick(gameID, cb);
        }, function (cb) {
            session.bind(gameID, cb);
        }, function (cb) {

            if (!userData || userData.length === 0) {
                next(null, {code: Code.OK});
                return;
            }

            //session.set('serverId', self.app.get('areaIdMap')[userData.areaId]);
            session.set('uid', userData.uid);
            session.set('gameID', userData.gameID);
            session.set('head', userData.head);
            session.set('account', userData.account);
            session.set('nickname', userData.nickname);
            session.set('strength', userData.strength);
            session.set('revival', userData.revival);
            session.on('closed', onUserLeave.bind(null, self.app, function (err) {
            }));
            session.pushAll(cb);
            console.log('userData.............................');
            console.log(session.settings)
        }, function (cb) {

            self.app.rpc.chat.chatRemote.add(session, userData.gameID, userData.nickname,
                channelUtil.getGlobalChannelName(), cb);
        }
    ], function (err) {
        console.log(err);
        if (err) {
            next(err, {code: Code.FAIL});
            return;
        }

        var utcMs = new Date().getTime().toString();//用户注册时间
        next(null, {code: Code.OK, utcMs: utcMs});
    });
};

handler.enterScene = function (msg, session, next) {
    var channelService = this.app.get('channelService');
    next(null, {code: Code.OK, player: 1});
};

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function (app, session) {
    if (!session || !session.gameID) {
        return;
    }

    utils.myPrint('1 ~ OnUserLeave is running ...');

    app.rpc.area.playerRemote.playerLeave(session, {playerId: session.get('playerId'), instanceId: session.get('instanceId')}, function (err) {
        if (!!err) {
            logger.error('user leave error! %j', err);
        }
    });

    app.rpc.chat.chatRemote.kick(session, session.gameID, function (err) {

    });
};