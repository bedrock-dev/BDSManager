const LOG_LEVEL = {
    "ERROR": 0,
    "WARNING": 1,
    "INFO": 2,
    "DEBUG": 3,
};

const styles = {
    'bold': ['\x1B[1m', '\x1B[22m'],
    'italic': ['\x1B[3m', '\x1B[23m'],
    'underline': ['\x1B[4m', '\x1B[24m'],
    'inverse': ['\x1B[7m', '\x1B[27m'],
    'strikethrough': ['\x1B[9m', '\x1B[29m'],
    'white': ['\x1B[37m', '\x1B[39m'],
    'grey': ['\x1B[90m', '\x1B[39m'],
    'black': ['\x1B[30m', '\x1B[39m'],
    'blue': ['\x1B[34m', '\x1B[39m'],
    'cyan': ['\x1B[36m', '\x1B[39m'],
    'green': ['\x1B[32m', '\x1B[39m'],
    'magenta': ['\x1B[35m', '\x1B[39m'],
    'red': ['\x1B[31m', '\x1B[39m'],
    'yellow': ['\x1B[33m', '\x1B[39m'],
    'whiteBG': ['\x1B[47m', '\x1B[49m'],
    'greyBG': ['\x1B[49;5;8m', '\x1B[49m'],
    'blackBG': ['\x1B[40m', '\x1B[49m'],
    'blueBG': ['\x1B[44m', '\x1B[49m'],
    'cyanBG': ['\x1B[46m', '\x1B[49m'],
    'greenBG': ['\x1B[42m', '\x1B[49m'],
    'magentaBG': ['\x1B[45m', '\x1B[49m'],
    'redBG': ['\x1B[41m', '\x1B[49m'],
    'yellowBG': ['\x1B[43m', '\x1B[49m']
};

let log_level = LOG_LEVEL.DEBUG;

function info(info) {
    if (log_level >= LOG_LEVEL.INFO)
        console.log(styles.green[0] +
            "[INFO: " + new Date().toLocaleString() + "] "
            + styles.green[1]
            + info
        );
}

function debug(info) {

    console.log(styles.blue[0] +
        "[DEBUG : " + new Date().toLocaleString() + "] "
        + styles.blue[1]
        + info
    );
}

function warning(info) {
    if (log_level >= LOG_LEVEL.WARNING)
        console.log(styles.yellow[0] +
            "[WARNING : " + new Date().toLocaleString() + "] "
            + styles.yellow[1]
            + info
        );
}

function error(info) {
    if (log_level >= LOG_LEVEL.ERROR)
        console.log(styles.red[0] +
            "[ERROR : " + new Date().toLocaleString() + "] "
            + styles.red[1]
            + info
        );
}

function serverInfo(msg) {
    console.log(styles.magenta[0] +
        "[SERVER] "
        + styles.magenta[1]
        + msg
    );
}

function setLogLevel(level) {
    log_level = level;
}

module.exports = {
    error,
    warning,
    info,
    debug,
    setLogLevel,
    serverInfo,
    LOG_LEVEL
};
