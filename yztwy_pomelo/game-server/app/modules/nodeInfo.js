/**
 * Created by quanquan.sun on 2016/11/8 0008.
 */

module.exports = function (opts) {
    return new nodeInfo(opts);
};

var moduleId = "nodeInfo";

module.exports.moduleId = moduleId;

var nodeInfo = function (opts) {
    this.app = opts.app;
    this.type = 'pull';
    this.interval = 10;
};


nodeInfo.prototype.monitorHandler = function (agent, msg) {

    agent.notify(moduleId, {serverId: agent.id,servers:[agent.id]});

};

nodeInfo.prototype.masterHandler = function (agent, msg) {
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

nodeInfo.prototype.clientHandler = function (agent, msg, cb) {
    // deal with client request,directly return data cached in master
    cb(null, agent.get(moduleId) || {});
};
