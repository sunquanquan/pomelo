var pomelo = require('pomelo');
var utils = require('../util/utils');

///////////////////统计材料//////////////////
exports.statisticsItem = function statisticsItem(userID, type, itemID, costType, cost, dateTime, num, pfID, cb) {
    var sql = "INSERT INTO log_item(userID,type,itemID,costType,cost,dateTime,num,pfID) VALUES(?, ?, ?, ?,?, ?, ?,?)";
    var args = [userID, type, itemID, costType, cost, dateTime, num, pfID];
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null) {
            utils.invokeCallback(cb, err.message, null);
        } else {
            utils.invokeCallback(cb, null, null);
        }
    });
};


///////////////////统计经验//////////////////
exports.statisticsExp = function statisticsGold(userID, lev, type, amount, addDT, oamount, pfID,cb) {
    var sql = "INSERT INTO log_exp(userID,lev,type,amount,addDT,oamount,pfID) VALUES(?, ?, ?, ?,?, ?, ?)";
    var args = [userID, lev, type, amount, addDT, oamount, pfID];
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null) {
            utils.invokeCallback(cb, err.message, null);
        } else {
            utils.invokeCallback(cb, null, null);
        }
    });
};
