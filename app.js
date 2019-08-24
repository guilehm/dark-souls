const express = require('express');

const DEBUG = process.env.DEBUG;
const PORT = process.env.PORT || 4000;

const app = new express();

const botController = require('./controllers/bot-controller');
const cleanStatsController = require('./controllers/clean-stats-controller');
const healthcheckController = require('./controllers/healthcheck-controller');

app.get('/', botController);
app.get('/stats/', cleanStatsController);
app.get('/healthcheck/', healthcheckController);

app.listen(PORT, () => {
    let message = DEBUG ? 'Starting development server on port' : 'App listening on port';
    console.log(message, `${PORT}`);
});
