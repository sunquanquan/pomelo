var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var utils = require('../util/utils');

var userDao = module.exports;

/**
 * get user infomation by userId
 * @param {String} uid UserId
 * @param {function} cb Callback function
 */
userDao.getUserById = function (gameID, cb){
	var sql = 'select * from acter_user where gameID = ?';
	var args = [gameID];
	pomelo.app.get('dbclient').query(sql,args,function(err, res){
		if(err !== null){
			utils.invokeCallback(cb,err.message, null);
			return;
		}

		if (!!res && res.length > 0) {
			utils.invokeCallback(cb, null, res[0]);
		} else {
			utils.invokeCallback(cb, ' user not exist ', null);
		}
	});
};

/**
 * Get an user's all players by userId
 * @param {Number} uid User Id.
 * @param {function} cb Callback function.
 */
userDao.getPlayersByUid = function(gameID, cb){
	var sql = 'select * from acter_user where gameID = ? limit 1';
	var args = [gameID];
	pomelo.app.get('dbclient').query(sql,args,function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err.message, null);
			return;
		}

		if(!res || res.length <= 0) {
			utils.invokeCallback(cb, null, []);
			return;
		} else {
			utils.invokeCallback(cb, null, res);
		}
	});
};

//更新用户信息
userDao.updatePlayer = function(sql,val, cb){
	var sql = sql;
	var args = val;
	console.log('updatePlayer,',sql,args);
	pomelo.app.get('dbclient').query(sql, args, function (err, res) {
		if (err !== null) {
			utils.invokeCallback(cb, err.message, null);
		}else{
			utils.invokeCallback(cb, null, null);
		}
	});
};

/**
 * get user infomation by userId
 * @param {String} uid UserId
 * @param {function} cb Callback function
 */
userDao.getUserByName = function (nickname, cb){
	var sql = 'select * from acter_user where nickname = ?';
	var args = [nickname];
	pomelo.app.get('dbclient').query(sql,args,function(err, res){
		if(err !== null){
			utils.invokeCallback(cb,err.message, null);
			return;
		}

		if (!!res && res.length > 0) {
			utils.invokeCallback(cb, null, res[0]);
		} else {
			utils.invokeCallback(cb, null, null);
		}
	});
};