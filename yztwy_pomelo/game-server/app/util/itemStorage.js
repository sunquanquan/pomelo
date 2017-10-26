/**
 * Created by hua.li on 2015/10/22.
 */
var statistics = require('../util/statistics');
var val = require('../util/getVal');
var checkLev = require('../util/checkLev');
var userDao = require('../dao/userDao');
var moment = require('moment');


module.exports = function itemStorage(session, materials, logType) {
    //session.get('playerId')
    var userData = session.settings;
    var updateSQL = "";
    var materialsForTask = [];
    var itemID = 0;
    var itemNum = 0;
    var itemType = 0;
    var vGlobal = val.val_global;
    var statisticsExp = statistics.statisticsExp;
    var statisticsGold = statistics.statisticsGold;
    var statisticsPearl = statistics.statisticsPearl;
    var statisticsItem = statistics.statisticsItem;
    var addExp = 0;
    var goldForTask = 0;
    var pearlForTask = 0;
    var upgradeRewards = [];
    var materialsRtn = [];
    var checkLevRtn = [];
    var hqMaterialsNum = 0;
    var star = 0;
    var expLogType = logType.expLogType == undefined ? 0 : logType.expLogType;
    var itemLogType = logType.itemLogType == undefined ? 0 : logType.itemLogType;
    var goldLogType = logType.goldLogType == undefined ? 0 : logType.goldLogType;
    var pearlLogType = logType.pearlLogType == undefined ? 0 : logType.pearlLogType;
    // 合并同类型奖励
    var rewards = materials;
    materials = [];
    var isRepeat = 0;
    for (var i = 0; i < rewards.length; i++) {
        isRepeat = 0;
        rewards[i].gsid = parseInt(rewards[i].gsid);
        rewards[i].num = parseInt(rewards[i].num);
        for (var j = 0; j < materials.length; j++) {
            if (materials[j].gsid == rewards[i].gsid) {
                materials[j].num += rewards[i].num;
                isRepeat++;
                break;
            }
        }
        if (0 == isRepeat) {
            materials.push(rewards[i]);
        }
    }

    for (var j = 0; j < materials.length; j++) {
        // 开始处理每一个物品
        itemID = materials[j].gsid;
        itemNum = materials[j].num;
        for (var i = 0; i < vGlobal.length; i++) {
            if (vGlobal[i].id == itemID) {
                itemType = vGlobal[i].type;
                star = vGlobal[i].star;
                break;
            }
        }
        if (4 == itemType) { // 经验
            addExp = itemNum;
            statisticsExp(userData.gameID, userData.lev, expLogType, addExp, moment().format('YYYY-MM-DD HH:mm:ss'), userData.exp, userData.platform, function (err) {
                if (err)console.log(err);
            });
            userData.exp = userData.exp + parseInt(addExp);
            session.set('exp', userData.exp);
            session.pushAll();
            checkLevRtn = checkLev(session, itemStorage);
            goldForTask += checkLevRtn.itemStorageRtn.goldForTask;
            pearlForTask += checkLevRtn.itemStorageRtn.pearlForTask;
            if (0 != checkLevRtn.itemStorageRtn.materialsForTask.length) {
                materialsForTask.push(checkLevRtn.itemStorageRtn.materialsForTask);
            }
            upgradeRewards = checkLevRtn.upgradeRewards;
            var updateSQL = 'UPDATE acter_user SET exp = ?, lev = ? where gameID = ?';
            var sqlValue = [userData.exp, userData.lev, userData.gameID];
            userDao.updatePlayer(updateSQL, sqlValue, function (err, user) {
                if (err) {
                    console.log(err);
                }
            });
        }
    }


    for (var i = 0; i < materials.length; i++) {
        for (var j = 0; j < vGlobal.length; j++) {
            if (vGlobal[j].id == materials[i].gsid && 5 != vGlobal[j].type && 8 != vGlobal[j].type) {
                materialsRtn.push({
                    'gsid': materials[i].gsid,
                    'num': materials[i].num
                });
                break;
            }
        }
    }

    var rtn = {
        'addExp': addExp,
        'goldForTask': goldForTask,
        'pearlForTask': pearlForTask,
        'materialsForTask': materialsForTask,
        'upgradeRewards': upgradeRewards,
        'materialsRtn': materialsRtn,
        'materials': materials
    };
    return rtn;

};