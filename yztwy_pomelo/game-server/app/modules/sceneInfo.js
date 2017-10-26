/**
 * Created by quanquan.sun on 2016/11/8 0008.
 */


module.exports = function (opts) {
    return new sceneInfo(opts);
};

var moduleId = "sceneInfo";

module.exports.moduleId = moduleId;

var sceneInfo = function (opts) {
    this.app = opts.app;
    this.type = 'pull';
    this.interval = 10;
};


sceneInfo.prototype.monitorHandler = function (agent, msg) {

    var sessionService = this.app.get('sessionService');
    if(sessionService!=undefined) {
        //console.log(sessionService);
        var a = this.app.components;
        var c = a.__connection__.service;
    }
    agent.notify(moduleId, {serverId: agent.id,servers:[agent.id]});

};

sceneInfo.prototype.masterHandler = function (agent, msg) {
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

sceneInfo.prototype.clientHandler = function (agent, msg, cb) {
    // deal with client request,directly return data cached in master
    cb(null, agent.get(moduleId) || {});
};
