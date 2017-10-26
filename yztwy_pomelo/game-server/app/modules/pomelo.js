/**
 * Created by quanquan.sun on 2016/11/4 0004.
 */
module.exports = function(opts)
{
    return new test(opts);
};

var moduleId = "pomelo";

module.exports.moduleId = moduleId;

var test = function(opts)
{
    this.app = opts.app;
    this.type = 'pull';
    this.interval = 10;
};

test.prototype.monitorHandler = function(agent, msg)
{
    var sessionService = this.app.get('sessionService');
    var uidmap = sessionService.service.uidMap;
    var allUserIds = Object.keys(uidmap);
    var uidInfos = new Array();
    for(var i =0;i<allUserIds;i++)
        {
            var gameID = allUserIds[i];
    var infos = uidmap[gameID];
    var uidInfo =
    {
        gameID:infos[0].gameID,
        frontendId:infos[0].frontendId,
        userName:infos[0].settings.userName,
        loginTime:infos[0].settings.loginTime
    };
    uidInfos.push(uidInfo);
}
agent.notify(moduleId, {serverId:agent.id,infos:uidInfos});
};


test.prototype.masterHandler = function(agent, msg)
{
    if (!msg)
    {
        agent.notifyByType("connector",moduleId);
    }
    else
    {
        agent.set(msg.serverId+moduleId, msg);
    }
};


test.prototype.clientHandler = function(agent, msg, cb)
{
    var connectors = this.app.getServersByType('connector');
    var users = new Array();
    for(var i =0;i<connectors.length;i++)
        {
            var co = connectors[i];
    var key = co.id+moduleId;
    var oneConnectorUsers = agent.get(key);
    for(var j = 0;j<oneConnectorUsers.length;i++)
        {
            var user = oneConnectorUsers.infos[j];
    users.push(user);
}
}
var returnData = {
    result:users
}
cb(null,returnData);
};
