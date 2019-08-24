const request = require('request');

const KEEP_ALIVE = process.env.KEEP_ALIVE || false;
const INTERVAL = process.env.INTERVAL || 5;


module.exports = (req, res, next) => {
    if (KEEP_ALIVE) {
        let hostname = req.headers.host;
        let protocol = req.connection.encrypted ? 'https' : 'http';
        let url = `${protocol}://${hostname}/healthcheck/`;

        function keepAlive(interval=INTERVAL) {
            interval = interval * 60 * 1000;
            setTimeout(() => {
                request.get(url);
                keepAlive(interval);
            }, interval);
        }

        keepAlive();
    };
    next();
};
