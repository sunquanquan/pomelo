/**
 * memcached 操作封装
 */
var time = 24 * 60 * 60;
var date = new Date();
var fs = require('fs');
var moment = require('moment');
var val = require('./getVal');
var conLogger = require('pomelo/node_modules/pomelo-logger').getLogger('con-log', __filename);

var memcacheConfig = JSON.parse(fs.readFileSync('../shared/config/memcache.json', "utf8"));
var memcache = {
    'open': function () {
        var Memcached = require('memcached');
        var memcached = new Memcached(memcacheConfig.memcacheOptions.ip + ":" + memcacheConfig.memcacheOptions.port);

        return memcached;
    },
    'set': function (key, value, callback) {
        var memcached = this.open();
        if (date.getHours() >= 0 && date.getHours() < 5) {
            time = 5 * 60 * 60 - (date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds());
        } else {
            time = 24 * 60 * 60 - (date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()) + 5 * 60 * 60;
        }
        memcached.set(key, value, time, function (err, result) {
            if (err) {
                callback(err, undefined);
            } else {
                callback(err, result);
            }
            memcached.end();
        });
    },

    'set30': function (key, value, time, callback) {
        var memcached = this.open();
        memcached.set(key, value, time, function (err, result) {
            if (err) {
                callback(err, undefined);
            } else {
                callback(err, result);
            }
            memcached.end();
        });
    },

    'get': function (key, callback) {
        var memcached = this.open();
        memcached.get(key, function (err, result) {
            if (err) {
                callback(err, undefined);
            } else {
                callback(err, result);
            }
            memcached.end();
        });
    },
    'gets': function (key, callback) {
        var memcached = this.open();
        memcached.gets(key, function (err, result) {
            if (err) {
                callback(err, undefined);
            } else {
                callback(err, result);
            }
            memcached.end();
        });
    },
    'cas': function (key, value, cas, time, callback) {
        var memcached = this.open();
        memcached.cas(key, value, cas, time, function (err, result) {
            if (err) {
                callback(err, undefined);
            } else {
                callback(err, result);
            }
            memcached.end();
        });
    },
    'add': function (key, value, time, callback) {
        var memcached = this.open();
        memcached.add(key, value, time, function (err, result) {
            if (err) {
                callback(err, result);
            } else {
                callback(err, result);
            }
            memcached.end();
        });
    },
    'append': function (key, value, time, callback) {
        var memcached = this.open();
        memcached.add(key, value, time, function (err, result) {
            if (err) {
                callback(err, result);
            } else {
                callback(err, result);
            }
            memcached.end();
        });
    },
    'del': function (key, callback) {
        var memcached = this.open();
        memcached.del(key, function (err, result) {
            if (err) {
                callback(err, undefined);
            } else {
                callback(err, result);
            }
            memcached.end();
        });
    },
    'update': function (key, value, callback) {
        var memcached = this.open();
        memcached.replace(key, value, time, function (err, result) {
            if (err) {
                callback(err, undefined);
            } else {
                callback(err, result);
            }
            memcached.end();
        });
    }
};

module.exports = memcache;