var Code = require('../../../../../shared/code');
var async = require('async');
var logger = require('pomelo-logger').getLogger(__filename);
var memcache = require('../../../util/getCache');
var commonDao = require('../../../dao/commonDao');

/**
 * Module dependencies
 */

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};
var handler = Handler.prototype;
/**
 * Player enter scene, and response the related information such as
 * playerInfo, areaInfo and mapData to client.
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @api public
 */
//获取用户数据
handler.getData = function (msg, session, next) {
    var channelService = this.app.get('channelService');
    var user = msg.user != undefined ? msg.user : 0;
    var roles = msg.roles != undefined ? msg.roles : 0;
    var level = msg.level != undefined ? msg.level : 0;
    var userData = {};//用户信息
    var rolesData;
    var levelData;

    var utcMs = new Date().getTime().toString();//当前时间
    var gameID = session.get('gameID');

    console.log('getData.................................');
    console.log(session.settings);
    //同步方法
    async.parallel([
            function (callback) {
                if (0 != roles) {//获取用户拥有的角色
                    var data = [];
                    commonDao.getAllRoles(gameID, function (err, roles) {
                        if (err) {
                            logger.error('Get roles failed! ' + err.stack);
                        }
                        if(roles != null){
                            data = roles;
                        }
                        callback(err, data);
                    });
                } else {
                    callback(null, 0);
                }
            },
            function (callback) {
                if (0 != level) {//获取用户关卡
                    var data = [];
                    commonDao.getLevels(gameID, function (err, levels) {
                        if (err) {
                            logger.error('Get levels failed! ' + err.stack);
                        }
                        if(levels != null){
                            data = levels;
                        }
                        callback(err, data);
                    });
                } else {
                    callback(null, 0);
                }
            }
        ],
        function (err, results) {
            if (err)console.log(err);
            //用户数据
            if (0 != user) {
                userData = {
                    "uid": session.settings.uid,
                    "gameID": session.settings.gameID,
                    "head": session.settings.head,
                    "account": session.settings.account,
                    "nickname": session.settings.nickname,
                    "strength": session.settings.strength,
                    "revival": session.settings.revival
                };
            }
            //角色信息
            if (0 != roles) {
                if (results[0] != null) {
                    logger.error(results[0]);
                    rolesData = results[0];
                }
            }
            //关卡信息
            if (0 != level) {
                if (results[1] != null) {
                    logger.error(results[1]);
                    levelData = results[1];
                }
            }

            next(null, {
                code: Code.OK,
                utcMs: utcMs,
                user: userData,
                roles: rolesData,
                level: levelData
            });
        });
};

