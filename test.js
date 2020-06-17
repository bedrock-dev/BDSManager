const  log = require("./simpleLogger");
const config = require("./config");
function logTest() {
    log.setLogLevel(log.LOG_LEVEL.INFO);
    log.warning("this is a warning");
    log.info("this is a info");
    log.error("this is s error");
    log.debug("this is a debug");
}

function readLogFile() {

}