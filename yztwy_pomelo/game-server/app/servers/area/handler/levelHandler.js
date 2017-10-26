/**
 * Created by quanquan.sun on 2017/10/9.
 */
var Code = require('../../../../../shared/code');
var async = require('async');
var logger = require('pomelo-logger').getLogger(__filename);
var memcache = require('../../../util/getCache');
var commonDao = require('../../../dao/commonDao');
var val = require('../../../util/getVal');
var logCode = require('../../../../../shared/logCode');
var itemStorage = require('../../../util/itemStorage');

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

//进入关卡
handler.enterLevel = function (msg, session, next) {
    var channelService = this.app.get('channelService');
    var clean = msg.clean != undefined ? msg.clean : 0;
    var level = msg.level != undefined ? msg.level : 0;
    var difficulty = msg.difficulty != undefined ? msg.difficulty : 0;
    var vLevel = val.val_level;
    var normalArr = [];
    var tempArr = [];
    var normalPass = 1;
    var userData = session.settings;//用户信息
    var utcMs = new Date().getTime().toString();//当前时间
    var strength = 0;

    for(var i=0;i<vLevel.length;i++){
        if(vLevel[i].type == 1){
            normalArr.push(vLevel[i].level);
        }
        if(vLevel[i].level == level && vLevel[i].difficulty == difficulty){
            strength = vLevel[i].strength;
        }
    }
    if(userData.strength >= strength) {
        if (clean == 0) {
            if (difficulty == 1) {//普通关卡
                //可以进入
                next(next(null, {code: Code.OK, utcMs: utcMs}));
            }else if(difficulty == 2){
                //判断普通关卡是否全部通过
                commonDao.getLevel(userData.gameID,function (err, res) {
                    if (err) console.log(err);
                    if (res != undefined && res.length > 0) {
                        for(var i=0;i<res.length;i++){
                            tempArr.push(res[i].level);
                        }
                        for(var j=0;j<normalArr.length;j++){
                            if(tempArr.indexOf(normalArr[i])<0){
                                normalPass = 0;
                            }
                        }
                        if(normalPass == 1){
                            //可以进入
                            next(next(null, {code: Code.OK, utcMs: utcMs}));
                        }else{
                            //普通关卡没有全部通过
                            next(next(null, {code: Code.AREA.FA_NOT_NORMAL_PASS, utcMs: utcMs}));
                        }
                    }else{
                        //普通关卡没有全部通过
                        next(next(null, {code: Code.AREA.FA_NOT_NORMAL_PASS, utcMs: utcMs}));
                    }
                })
            }else if(difficulty == 3){
                //可以进入
                next(next(null, {code: Code.OK, utcMs: utcMs}));
            }else{
                //参数错误
                next(next(null, {code: Code.FAIL_PARAM, utcMs: utcMs}));
            }
        } else if (clean == 1) {
            //是扫荡
            if (difficulty == 3) {//英雄关卡
                //判断该关卡是否已经三星
                commonDao.getLevelStars(userData.gameID,level,function (err, res) {
                    if (err) console.log(err);
                    if (res != undefined && res.length > 0) {
                        if(res[0].star == 3){
                            //冷却时间
                            memcache.get(userData.gameID + "levelTime"+level, function (err, levelTime) {
                                if (levelTime == false) {
                                    //可以进入
                                    next(next(null, {code: Code.OK, utcMs: utcMs}));
                                } else {
                                    //冷却时间没有到
                                    next(next(null, {code: Code.AREA.FA_NOT_CD_TIME, utcMs: utcMs}));
                                }
                            })
                        }else{
                            //未达到三星
                            next(next(null, {code: Code.AREA.FA_NOT_stars, utcMs: utcMs}));
                        }
                    }else{
                        //未达到三星
                        next(next(null, {code: Code.AREA.FA_NOT_stars, utcMs: utcMs}));
                    }
                })
            } else {
                //参数错误
                next(next(null, {code: Code.FAIL_PARAM, utcMs: utcMs}));
            }
        } else {
            //参数错误
            next(next(null, {code: Code.FAIL_PARAM, utcMs: utcMs}));
        }
    }else{
        //体力值不足
        next(next(null, {code: Code.AREA.FA_NOT_strength, utcMs: utcMs}));
    }
};

//同步数据
handler.syncLevel = function (msg, session, next) {
    var channelService = this.app.get('channelService');
    var utcMs = new Date().getTime().toString();//当前时间
    var exp = msg.exp != undefined ? msg.exp : 0;
    var items = msg.items != undefined ? msg.items : 0;
    var commit = msg.commit != undefined ? msg.commit : 0;//1：刷新提交 2：结束提交
    var pass = msg.pass != undefined ? msg.pass : 0;//是否过关
    var stars = msg.stars != undefined ? msg.stars : 0;//过关星星数
    var clean = msg.clean != undefined ? msg.clean : 0;//0：不是扫荡 1：是扫荡
    var userData = session.settings;//用户信息
    var itemStorageRtn = [];
    var materials = [];
    materials.push(items,exp);
    if(commit == 2){//结束提交
        //是否过关
        if(pass == 1) {
            //查看获得的奖励是否已满，如果满，有随机奖励
            memcache.get(userData.uid + "levelReward", function (err, rewards) {
                if (err) logger.error(err);
                if (rewards != false) {
                    if (rewards >= 5) {//奖励数满随机一个奖励
                        var itemArr = [];
                        var randomReward = parseInt(Math.random() * itemArr.length);
                        materials.push(itemArr[randomReward]);
                    }
                }
            });
        }else{
            //记录过关星星数
        }
        if(clean == 1){//如果是扫荡记录时间

        }
    }
    var logType = {
        'expLogType': logCode.ITEM.LEVEL_GET,
        'itemLogType': logCode.EXP.LEVEL_GET
    };
    itemStorageRtn = itemStorage(session, materials, logType);
    next(next(null, {code: Code.OK, utcMs: utcMs}));
};