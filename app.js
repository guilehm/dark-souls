const express = require('express');
const logger = require('heroku-logger');
const request = require('request');

const DEBUG = process.env.DEBUG;
const PORT = process.env.PORT || 4000;
const SELF_ENDPOINT = process.env.SELF_ENDPOINT;

const app = new express();

const botController = require('./controllers/bot-controller');
const cleanStatsController = require('./controllers/clean-stats-controller');
const healthcheckController = require('./controllers/healthcheck-controller');
const keepAliveController = require('./controllers/keep-alive-controller');
const codController = require('./controllers/cod-controller');

app.get('/', keepAliveController, botController);
app.get('/keep-alive/', keepAliveController);
app.get('/stats/', cleanStatsController);
app.get('/healthcheck/', healthcheckController);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://guilehm.github.io');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get(/(.*)/, codController);


app.listen(PORT, () => {
    let message = DEBUG ? 'Starting development server on port ' : 'App listening on port ';
    logger.info(message + `${PORT}`);
    if (SELF_ENDPOINT) {
        request.get(SELF_ENDPOINT);
    }
});
