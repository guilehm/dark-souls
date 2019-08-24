const nodeLogger = require('node-logger');
const logger = nodeLogger.createLogger();

module.exports = (req, res) => {
    let message = "bot is healthy";
    logger.info(message);
    res.status(200).end(JSON.stringify({
        message
    }));
};
