const sqlite3 = require('sqlite3');
const config = require("./config");
const logger = require("./simpleLogger");
logger.info("preparing sqlite");
let db = new sqlite3.Database(config.dbFileName);
const moment = require('moment');

function tryCreateTable() {
    logger.info("try to create player_record table db file");
    db.run("CREATE TABLE  if not exists play_record( \
        record_id integer primary key autoincrement ,\
    player_id VARCHAR(64) not null ,\
    conn_time timestamp   not null, \
    play_time int         not null\
    )");
}


function customTimeLine(playerId, begin, end) {
    logger.debug(begin + "  " + end + "    " + playerId);
    const query = 'select DATE(conn_time) AS `dates`, ROUND(SUM(play_time / 60), 2) AS `times`\
        from play_record \
        where date(conn_time) between DATE($begin) AND DATE($end)\
          AND player_id = $id \
        group by DATE(conn_time)';

    return new Promise((resolve, reject) => {
        db.all(query,
            {
                $begin: begin,
                $end: end,
                $id: playerId,
            }, (err, rows) => {
                if (err) {
                    reject(err);
                    logger.debug("error");
                } else {
                    logger.debug("[customTimeLine]" ,rows);
                    resolve(rows);
                }
            });
    });
}


let customTimeCount = function (playerId, begin, end) {
    const query = 'select player_id, ROUND(SUM(play_time / 60),2) AS `time` \
    from play_record \
    where DATE(conn_time) between DATE($begin) and DATE($end) \
    and player_id like  $id  \
    group by player_id \
    order by `time` desc';
    return new Promise((resolve, reject) => {
        db.all(query,
            {
                $begin: begin,
                $end: end,
                $id: '%' + playerId + '%',
            }, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows);
                }
            });
    });
};

function sumPlayerTime() {
    const query = 'select ROUND(SUM(play_time)/60,2) as `time` from play_record';
    return new Promise((resolve, reject) => {
        db.get(query, (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row.time)
            }
        });
    });
}


// offset since today
// async function getOneDayTimeCount(day) {
//     const time = moment().subtract(day, 'days').format("YYYY-MM-DD");
//     let rows =  await customTimeCount('', time, time);
//     logger.debug(rows);
// }

function getFullTimeCount() {
    const query = "select player_id, ROUND(SUM(play_time / 60),2) AS `time` \
        from play_record  \
        group by player_id \
        order by `time` desc";
    db.all(query, function (err, row) {
        console.log(JSON.stringify(row));
    });
}


function insertRecord(playerID, connTime, playTime) {
    db.run("insert into play_record values(NULL, $player_id, $conn_time,$play_time)", {
        $player_id: playerID,
        $conn_time: connTime,
        $play_time: playTime
    });
}

tryCreateTable();

module.exports = {
    insertRecord,
    customTimeCount,
    getFullTimeCount,
    customTimeLine,
    sumPlayerTime,
};

// async function test() {
//     const end = moment().format("YYYY-MM-DD");
//     const rows = await customTimeLine('hhhxiao', config.serverStartTime, end);
//     logger.debug(rows);
// }
// test();
// // const day = moment().format("YYYY-MM-DD");
// // customTimeLine('hhhxiao', day, day);
// // let date = [];
// // let time = [];