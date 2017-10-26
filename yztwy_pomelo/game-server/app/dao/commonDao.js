/**
 * Created by quanquan.sun on 2017/10/11.
 */
var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var utils = require('../util/utils');

var commonDao = module.exports;

//获取玩家的关卡信息
commonDao.getLevel = function (gameID, cb){
    var sql = 'select level from acter_level where gameID = ?';
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

//获取该关卡的星级
commonDao.getLevelStars = function (gameID,level, cb){
    var sql = 'select star from acter_level where gameID = ? and level = ?';
    var args = [gameID,level];
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
console.log('3333333333333333333333');
//获取玩家拥有的所有角色
commonDao.getAllRoles = function (gameID, cb){
    console.log('222222222222222222222');
    console.log(gameID);
    var sql = 'select roleID from acter_role where gameID = ?';
    var args = [gameID];
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

//获取玩家通过的关卡和星星数
commonDao.getLevels = function (gameID, cb){
    var sql = 'select level,star from acter_level where gameID = ?';
    var args = [gameID];
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