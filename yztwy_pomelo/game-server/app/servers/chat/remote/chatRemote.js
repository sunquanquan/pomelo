module.exports = function(app) {
	return new ChatRemote(app, app.get('chatService'));
};

var ChatRemote = function(app, chatService) {
	this.app = app;
	this.chatService = chatService;
};

/**
 *	Add player into channel
 */
ChatRemote.prototype.add = function(gameID, playerName, channelName, cb) {
	var code = this.chatService.add(gameID, playerName, channelName);
	cb(null, code);
};

/**
 * leave Channel
 * uid
 * channelName
 */
ChatRemote.prototype.leave =function(gameID, channelName, cb){
	this.chatService(gameID, channelName);
	cb();
};

/**
 * kick out user
 *
 */
ChatRemote.prototype.kick = function(gameID, cb){
	this.chatService.kick(gameID);
	cb();
};
