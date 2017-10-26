var crc = require('crc');

module.exports.dispatch = function (gameID, connectors) {
    //var index = Number(uid) % connectors.length;
    var index = parseInt(Math.random() * 100 + 1) % connectors.length;
    console.log('dispatcher.....................................');
    console.log('index= ' + index);
    return connectors[index];
};
