const logger = require("./simpleLogger");
const fs = require('fs');
const config = require("./config");
const moment = require('moment');
const dbm = require("./dbManager");
const {spawn} = require('child_process');
let playerList = new Map();
let coreProcess;
let lastBackupTime;
let serverStatus;
let output = fs.createWriteStream('server.log');

function backup() {
    if (moment().diff(lastBackupTime, 'days') >= config.backupCycle) {
        logger.info("begin Backup");
        sendCommand("say [Server]: begin backup");
        //这里是备份的代码
        logger.info("end Backup");
        sendCommand("backup finish");
    }
}


function spawnServerProcess() {
    logger.info("starting game server");
    if (config.autoBackup) {
        logger.info("init the start backup time");
    }
    lastBackupTime = moment();
    coreProcess = spawn(config.serverPath + 'bedrock_server.exe');

    serverStatus = true;

    coreProcess.on('error', (err) => {
        processExit(err);
    });
    coreProcess.on('exit', (code) => {
        processExit(code);
    });

    let buff;
    coreProcess.stdout.on('data', (chunk) => {
        let str = chunk.toString();
        buff = buff + str;
        if (/\n/g.test(str)) {
            if (buff.indexOf("INFO] Player") !== -1) {
                if (config.autoBackup) {
                    backup();
                }

                const playerName = buff.match(/(?<=connected: )(.*)(?=, xuid)/g)[0];
                processRecord(playerName);
            }
            logger.serverInfo(buff);
            buff = "";
        }
    });
    //控制命令输入到服务器后台
    process.stdin.pipe(coreProcess.stdin);
    //输出服务器日常到文件
    coreProcess.stdout.pipe(output);
}

function sendCommand(cmd) {
    coreProcess.stdin.write(cmd);
}

function processRecord(playerId) {
    const time = playerList.get(playerId);
    if (time === undefined) {
        logger.info(playerId + " enter the game");
        playerList.set(playerId, moment());
    } else {
        logger.info(playerId + " left the game");
        dbm.insertRecord(playerId, time.format('YYYY-MM-DD HH:MM:SS'), moment().diff(time) / 36000);
        playerList.delete(playerId);
    }
}


function processExit(msg) {
    serverStatus = false;
    logger.info("server stop " + msg);
    logger.info("process extra data,please do not close console");
    playerList.forEach(function (value, key) {
        dbm.insertRecord(key, value.format('YYYY-MM-DD HH:MM:SS'), moment().diff(value) / 36000);
    });
    playerList.clear();
    logger.info("extra data process finished please restart this server");
}

module.exports = {
    coreProcess,
    spawnServerProcess,
    sendCommand,
    playerList
};


// function importLog() {
//     const str = fs.readFileSync("server.log", "utf-8");
//     const recordArray = str.split('\n');
//     recordArray.forEach(function (line) {
//         if (line.indexOf("INFO] Player") !== -1) {
//
//             const timePoint = line.match(/\[(.+?)\]/g)[0].slice(1, 20);
//             const data = moment(timePoint);
//             const playerName = line.match(/(?<=connected: )(.*)(?=, xuid)/g)[0];
//             const op = line.indexOf("Player connected") !== -1;
//
//             const time = playerList.get(playerName);
//             if (op) {
//                 if (time === undefined) {//玩家不在列表
//                     playerList.set(playerName, data);
//                 }
//             } else {//这是一条离线记录
//                 if (time !== undefined) {
//                     //   console.log(data.diff(time)/36000);
//                     //console.log(playerName + " - " + time.toLocaleString() + "----" + data.toLocaleString() + "   " + hour);
//                     dbm.insertRecord(playerName, time.format('YYYY-MM-DD HH:MM:SS'), data.diff(time) / 36000);
//                     playerList.delete(playerName);
//                 }
//             }
//         }
//     });
// }