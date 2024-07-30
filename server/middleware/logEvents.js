const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'dd.MM.yyyy\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, "..", 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, "..", 'logs'));
        }

        await fsPromises.appendFile(path.join(__dirname, "..", 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

const logger = (req, res, next) => {
    const msg = `${req.method}\t${req.headers.origin}\t${req.url}` + (req.headers["authorization"] ? `\t${req.headers["authorization"]}` : "");
    logEvents(msg, "reqLog.txt");
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = { logger, logEvents };