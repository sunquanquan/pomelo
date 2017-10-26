/**
 * Created by quanquan.sun on 2016/11/4 0004.
 */

module.exports = function (opts) {
    return new scripts(opts);
};
var moduleId = "scripts";

module.exports.moduleId = moduleId;

var scripts = function (opts) {
    this.app = opts.app;
    this.type = 'pull';
    this.interval = 10;
};


scripts.prototype.monitorHandler = function (agent, msg) {

    var sessionService = this.app.get('sessionService');
    var address = this.app.curServer.host;
    var time = this.app.startTime;
    var uidInfos = new Array();
    if (sessionService != undefined) {
        var uidmap = sessionService.service.uidMap;
        var allUserIds = Object.keys(uidmap);
        for (var i = 0; i < allUserIds.length; i++) {
            var gameID = allUserIds[i];
            var infos = uidmap[gameID];
            var a = infos[0].__socket__._events;
            var b = infos[0].__socket__;
            //console.log(b);
            var uidInfo =
            {
                gameID: infos[0].gameID,
                frontendId: infos[0].frontendId,
                //userName: infos[0].settings.userName,
                //loginTime: infos[0].settings.loginTime
                userName: infos[0].settings.rid,
                address:address,
                loginTime: this.app.startTime
            };
            uidInfos.push(uidInfo);
        }
    }

    agent.notify(moduleId, {serverId: agent.id});

};

scripts.prototype.masterHandler = function (agent, msg) {
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

scripts.prototype.clientHandler = function (agent, msg, cb) {
    // deal with client request,directly return data cached in master
    cb(null, agent.get(moduleId) || {});
};
