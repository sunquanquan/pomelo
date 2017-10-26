/**
 * Created by jane on 2016/12/19.
 */
var pomelo = require('pomelo');
var val = require('./getVal');
var logCode = require('../../../shared/logCode');

//////////////////////等级判断 升级奖励/////////////////////
module.exports = function checkLev(session, itemStorage) {
    var userData = session.settings;
    var rtn;
    var materials = [];
    var rewards = [];
    var lev = 0;
    var items;
    var itemStorageRtn;
    var vUseExp = val.val_userExp;
    var vGlobal = val.val_global;
    if (userData.exp < vUseExp[0].exp) {
        lev = 1;
    } else if (userData.exp >= vUseExp[vUseExp.length - 1].exp) {
        lev = vUseExp.length;
    } else {
        for (var i = 0; i < vUseExp.length - 1; i++) {
            if (userData.exp >= vUseExp[i].exp && userData.exp < vUseExp[i + 1].exp) {
                lev = i + 1;
                break;
            }
        }
    }
    console.log(userData.lev, lev);
    if (userData.lev < lev) {
        var index = 0;
        if (1 != userData.lev) {
            index = userData.lev;
        }
        for (var j = index; j <= lev - 1; j++) {
            if (vUseExp[j].reward != "") {
                items = vUseExp[j].reward.split(";");
                for (var i = 0; i < items.length; i++) {
                    rewards.push({
                        'gsid': parseInt(items[i].split(":")[0]),
                        'num': parseInt(items[i].split(":")[1])
                    });
                }
            }
        }
    }
    if (userData.lev != lev) {
        userData.lev = lev;
    }
    // 登记所获物品
    var logType = {
        'goldLogType': logCode.GOLD.UPGRADE_GET,
        'itemLogType': logCode.ITEM.UPGRADE_GET,
        'pearlLogType': logCode.PEARL.UPGRADE_GET
    };
    session.set('exp', userData.exp);
    session.set('lev', userData.lev);
    session.pushAll();
    itemStorageRtn = itemStorage(session, rewards, logType);
    materials = itemStorageRtn.materials;
    upgradeRewards = itemStorageRtn.upgradeRewards;

    for (var i = 0; i < materials.length; i++) {
        for (var j = 0; j < vGlobal.length; j++) {
            if (vGlobal[j].id == materials[i].gsid) {
                upgradeRewards.push({
                    'gsid': materials[i].gsid,
                    'num': materials[i].num
                });
                break;
            }
        }
    }
    var isRepeat = 0;
    var temp = upgradeRewards;
    upgradeRewards = [];
    for (var i = 0; i < temp.length; i++) {
        isRepeat = 0;
        for (var j = 0; j < upgradeRewards.length; j++) {
            if (upgradeRewards[j].gsid == temp[i].gsid) {
                upgradeRewards[j].num += temp[i].num;
                isRepeat++;
                break;
            }
        }
        if (0 == isRepeat) {
            upgradeRewards.push(temp[i]);
        }
    }
    rtn = {
        'itemStorageRtn': itemStorageRtn,
        'upgradeRewards': upgradeRewards
    };

    return rtn;
};