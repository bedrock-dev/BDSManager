const logger = require("./simpleLogger");
const config = require("./config");
let fs = require('fs');
const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
const moment = require('moment');
const game = require("./coreProcess");
const dbm = require("./dbManager");
const session = require('koa-session');
//session config come from web
const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** (boolean) httpOnly or not (default true) */
    signed: true,
    /** (boolean) signed or not (default true) */
    rolling: false,
    /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};


function startWebServer() {
    logger.info("webServer Start");
    app.use(async (ctx, next) => {
        console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
        await next();
    });

    router.get('/inServer', async (ctx, next) => {
        ctx.response.type = 'application/json';
        let list = [];
        game.playerList.forEach(function (value, key) {
            list.push(value);
        });
        ctx.body = JSON.stringify(list);
    });

    router.get('/data', async (ctx, next) => {
        ctx.response.body = fs.readFileSync("./pages/data.html", 'utf-8');
    });

    //todayCount
    router.get('/todayCount', async (ctx, next) => {
        let {offset} = ctx.query;
        const day = moment().subtract(offset, 'days').format("YYYY-MM-DD");
        let rows = await dbm.customTimeCount('', day, day);
        let players = [];
        let times = [];
        rows.forEach(row => {
            players.push(row.player_id);
            times.push(row.time);
        });
        ctx.body = {
            "players": players,
            "times": times
        };
    });

    router.get('/timeLine', async (ctx, next) => {
        const day = moment().format("YYYY-MM-DD");
        let {id} = ctx.query;
        let rows = await dbm.customTimeLine(id, config.serverStartTime, day);
        let dat = [];
        let time = [];
        rows.forEach(row => {
            dat.push(row.dates);
            time.push(row.times);
        });
        logger.debug("dat" + dat, "\ntime" + time);
        ctx.body = {
            "date": dat,
            "time": time
        };
    });


    router.get('/', async (ctx, next) => {
        ctx.response.body = fs.readFileSync("./pages/index.html", 'utf-8');
    });

    router.get('/index', async (ctx, next) => {
        ctx.response.body = fs.readFileSync("./pages/index.html", 'utf-8');
    });
    router.get('/player', async (ctx, next) => {
        ctx.response.body = fs.readFileSync("./pages/player.html", 'utf-8');
    });

    router.get('/manager', async (ctx, next) => {
        if (ctx.session.login) {
            ctx.response.body = fs.readFileSync("./pages/manager.html", 'utf-8');
        } else {
            ctx.response.body = fs.readFileSync("./pages/index.html", 'utf-8');
        }
    });


    router.get('/allTime', async (ctx, next) => {
        ctx.body = await dbm.sumPlayerTime();
    });


    router.get('/doLogin', async (ctx, next) => {
        let {password} = ctx.query;
        if (config.webPassword === password) {
            ctx.session.login = true;
        }
    });

    //whitelist
    router.get('/whiteList', async (ctx, next) => {
        const list = JSON.parse(
            fs.readFileSync(config.serverPath + 'whitelist.json', 'utf-8'
            ).toString());
        ctx.response.type = 'application/json';
        ctx.body = JSON.stringify(list);
    });


    app.use(router.routes());
    app.use(session(CONFIG, app));
    app.listen(config.port);
    logger.info("server start at port: " + config.port);
}

game.spawnServerProcess();
if (config.enableWeb) {
    startWebServer();
}








