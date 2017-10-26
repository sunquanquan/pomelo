/**
 * Created by quanquan.sun on 2016/11/3 0003.
 */

module.exports = function (opts) {
    return new onlineUser(opts);
};

var moduleId = "onlineUser";

module.exports.moduleId = moduleId;

var onlineUser = function (opts) {
    this.app = opts.app;
    this.type = 'pull';
    this.interval = 10;
};


/*
 var Module = function (app, opts) {
 opts = opts || {};
 this.type = opts.type || 'pull';
 this.interval = opts.interval || 5;
 };

 Module.moduleId = 'onlineUser';

 module.exports = Module;*/

onlineUser.prototype.monitorHandler = function (agent, msg) {

    var c = {};
    var info;
    var userName;
    var infoList = [];
    var b={};
    var sessionService = this.app.get('sessionService');
    if (sessionService != undefined) {
        var a = this.app.components;
        var c = a.__connection__.service;
        var uidmap = sessionService.service.uidMap;
        var allUserIds = Object.keys(uidmap);
        if(JSON.stringify(c.logined)!="") {
            for (var i = 0; i < allUserIds.length; i++) {
                var gameID = allUserIds[i];
                userName = uidmap[gameID];
                info = c.logined;
                var d = info[gameID];
                 b = {
                    totalConnCount:c.connCount,
                    loginedCount:c.loginedCount,
                    userName:userName[0].settings.rid
                };
                infoList.push(d);
            }
        }
    }
    //agent.notify(moduleId, {serverId: agent.id,infos:b,loginedList: infoList});
    agent.notify(moduleId, {serverId: agent.id,totalConnCount: b,loginedList: infoList});
};

onlineUser.prototype.masterHandler = function (agent, msg) {
    // if no message, then notify all monitors to fetch datas
    if (!msg) {
        agent.notifyAll(moduleId);
        return;
    }
    // collect data from monitor
    var data = agent.get(moduleId);
    if (!data) {
        data = {};
        agent.set(moduleId, data);
    }

    data[msg.serverId] = msg;
};

onlineUser.prototype.clientHandler = function (agent, msg, cb) {
    // deal with client request,directly return data cached in master
    cb(null, agent.get(moduleId) || {});
};
