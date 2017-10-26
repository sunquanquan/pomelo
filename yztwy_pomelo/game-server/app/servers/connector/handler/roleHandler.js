var Code = require('../../../../../shared/code');
var async = require('async');
var utils = require('../../../util/utils');
var val = require('../../../util/getVal');
var logger = require('pomelo-logger').getLogger(__filename);
var userDao = require('../../../dao/userDao');

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
//创建角色
handler.createPlayer = function (msg, session, next) {
    var gameID = session.uid;
    var hideName = val.val_hide.split(",");
    var illegal = 0;//用户名是否合法
    var nickname = msg.nickname;
    var utcMs = new Date().getTime().toString();//当前时间
    if (nickname.length <= 8) {
        //判断敏感词
        hideName.forEach(function (e) {
            if (nickname.toLowerCase().indexOf(e.toLowerCase()) != -1) {
                illegal = 1;
            }
        });
        if (illegal == 1) {
            next(null, {code: Code.CONNECTOR.FA_ILLEGAL_NICKNAME, utcMs: utcMs});//词汇太敏感了哟
        } else {
            userDao.getUserByName(nickname, function (err, res) {
                if (err != null)console.log(err);
                if (res == null) {
                    var updateSQL = 'update acter_user set nickname = ? where gameID = ?';
                    var sqlValue = [nickname, gameID];
                    session.set('userName', nickname);
                    session.pushAll();
                    userDao.updatePlayer(updateSQL, sqlValue, function (err, user) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    next(null, {code: Code.OK, utcMs: utcMs});
                } else {
                    next(null, {code: Code.CONNECTOR.FA_REPEAT_NICKNAME, utcMs: utcMs});//昵称已占用
                }
            });
        }
    } else {
        next(null, {code: Code.CONNECTOR.FA_LONG_NICKNAME, utcMs: utcMs});//用户名太长
    }
};

