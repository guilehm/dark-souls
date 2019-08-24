const request = require('request');
const nodeLogger = require('node-logger');

const KEEP_ALIVE = process.env.KEEP_ALIVE || false;
const INTERVAL = process.env.INTERVAL || 5;

let interval = INTERVAL * 60 * 1000;
const logger = nodeLogger.createLogger();


module.exports = (req, res, next) => {
    if (KEEP_ALIVE) {
        let hostname = req.headers.host;
        let protocol = req.connection.encrypted ? 'https' : 'http';
        let url = `${protocol}://${hostname}/healthcheck/`;

        function keepAlive() {
            setTimeout(() => {
                logger.info(`ping every ${interval} seconds.`);
                request.get(url);
                keepAlive(interval);
            }, interval);
        }

        keepAlive();
    };
    res.send(JSON.stringify({
        success: true
    }));
    next();
};
