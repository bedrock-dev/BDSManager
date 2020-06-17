const fs = require('fs');
const logger = require("./simpleLogger");

//留着方便代码提示
let config = {
    serverName: "SAC",
    serverPath: "/server-folder",
    serverStartTime: "2019-6-12",
    serverPlatform: "Windows",
    dbFileName: "./db-file.db",
    autoBackup: true,
    enableWeb: true,
    backupCycle: 3,
    webRunCommand: false,
    webShowStartTime: true,
    webPermission: "all",
    webPassword: 121313,
    port: 80
};
//读取配置文件
logger.info("read config file");
let configFile;
try {
    configFile = fs.readFileSync('config.json', 'utf8');
} catch (err) {
    logger.error(err);
}

config = JSON.parse(configFile);
console.log("random Password:  " + Math.random().toString().slice(-16));
logger.info("webShowStartTime: " + config.webShowStartTime);
logger.info("webPassword: " + config.webPassword);
logger.info("webPermission:  " + config.webPermission);
logger.info("webRunCommand:  " + config.webRunCommand);
logger.info("serverStartTime: " + config.serverStartTime);
logger.info("serverPlatform: " + config.serverPlatform);
logger.info("serverPath: " + config.serverPath);
logger.info("dbFileName: " + config.dbFileName);
logger.info("enableAutoBackup: " + config.autoBackup);
logger.info("backupRecycle " + config.backupCycle+" days");
logger.info("enableWebPages:  " + config.enableWeb);
logger.info("success read config file");
module.exports = config;


