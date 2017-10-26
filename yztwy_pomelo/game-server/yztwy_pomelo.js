var pomelo = require('pomelo');
var ChatService = require('./app/services/chatService');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'chatofpomelo-websocket');

// configure for global
app.configure('production|development', function () {
    app.loadConfig('mysql', app.getBase() + '/../shared/config/mysql.json');
});
// app configuration
app.configure('production|development', 'connector', function () {
    app.set('connectorConfig', {
        connector: pomelo.connectors.hybridconnector,
        heartbeat: 30,
        //useDict: true,
        useProtobuf: true,
        handshake: function (msg, cb) {
            cb(null, {});
        }
    });
});

app.configure('production|development', 'gate', function () {
    app.set('connectorConfig', {
        connector: pomelo.connectors.hybridconnector,
        useDict: true,
        useProtobuf: true
    });
});



// Configure for auth server
app.configure('production|development', 'auth', function () {
    // load session congfigures
    app.set('session', require('./config/session.json'));
});

// Configure database
app.configure('production|development', 'gate|area|auth|connector|master', function () {
    var dbclient = require('./app/dao/mysql/mysql').init(app);
    app.set('dbclient', dbclient);
});

// Configure for chat server
app.configure('production|development', 'chat', function () {
    app.set('chatService', new ChatService(app));
});

// start app
app.start();

process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});
