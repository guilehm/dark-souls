const logger = require('heroku-logger');


const axios = require('axios');
module.exports = async (req, res) => {
    const endpoint = req.params[0];
    const url = `https://api.tracker.gg${endpoint}`;
    try {
        const urlParts = url.split('/');
        const username = urlParts.pop();
        const endpoint = `${urlParts.join('/')}/${encodeURIComponent(username)}`;
        logger.info(`Requesting to ${endpoint}`);
        const response = await axios.get(endpoint);
        res.json(response.data);
    } catch (e) {
        logger.error(e.message);
    }
};
