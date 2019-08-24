const express = require('express');
const nodeLogger = require('node-logger');

const DEBUG = process.env.DEBUG;
const PORT = process.env.PORT || 4000;

const app = new express();
const logger = nodeLogger.createLogger();

const botController = require('./controllers/bot-controller');
const cleanStatsController = require('./controllers/clean-stats-controller');
const healthcheckController = require('./controllers/healthcheck-controller');
const keepAliveController = require('./controllers/keep-alive-controller');

app.get('/', keepAliveController, botController);
app.get('/keep-alive/', keepAliveController);
app.get('/stats/', cleanStatsController);
app.get('/healthcheck/', healthcheckController);

app.listen(PORT, () => {
    let message = DEBUG ? 'Starting development server on port' : 'App listening on port';
    logger.info(message, `${PORT}`);
});
