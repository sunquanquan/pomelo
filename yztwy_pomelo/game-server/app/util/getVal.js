var fs = require('fs');

//数值表资源文件加载
exports.val_level = JSON.parse(fs.readFileSync('../../resources/val_level.json', "utf8"));


fs.watchFile('../../resources/val_level.json', function (curr, prev) {
    exports.val_level = JSON.parse(fs.readFileSync('../../resources/val_level.json', "utf8"));
    console.log("val_level has been changed");
});
