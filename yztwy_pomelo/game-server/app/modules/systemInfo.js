/**
 * Created by quanquan.sun on 2016/11/4 0004.
 */

module.exports = function (opts) {
    return new systemInfo(opts);
};

var moduleId = "systemInfo";

module.exports.moduleId = moduleId;

var systemInfo = function (opts) {
    this.app = opts.app;
    this.type = 'pull';
    this.interval = 10;
};


systemInfo.prototype.monitorHandler = function (agent, msg) {

  /*  var sessionService = this.app.get('sessionService');
    var address = this.app.curServer.host;
    var time = this.app.startTime;
    var uidInfos = new Array();
    if (sessionService != undefined) {
        var uidmap = sessionService.service.uidMap;
        var allUserIds = Object.keys(uidmap);
        console.log(allUserIds);
        for (var i = 0; i < allUserIds.length; i++) {
            var uid = allUserIds[i];
            var infos = uidmap[uid];
            var uidInfo =
            {
                uid: infos[0].uid,
                frontendId: infos[0].frontendId,
                userName: infos[0].settings.rid,
                address:address,
                loginTime: this.app.startTime
            };
            uidInfos.push(uidInfo);
        }
    }*/
    agent.notify(moduleId, {serverId: agent.id,servers:[agent.id]});

};

systemInfo.prototype.masterHandler = function (agent, msg) {
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

systemInfo.prototype.clientHandler = function (agent, msg, cb) {
    // deal with client request,directly return data cached in master
    cb(null, agent.get(moduleId) || {});
};
