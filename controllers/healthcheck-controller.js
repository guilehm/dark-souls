const logger = require('heroku-logger');


module.exports = (req, res) => {
    let message = "bot is healthy";
    logger.info(message);
    res.status(200).json({
        message
    });
};
