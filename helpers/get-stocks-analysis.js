const request = require('request');
const logger = require('heroku-logger');


function getStockAnalysis(stock) {
    const stocksEndpoint = process.env.STOCKS_ENDPOINT;

    let handleError = (error, message) => {
        logger.error(error);
        return JSON.stringify({
            error: true,
            message: message,
        });
        
    };

    let handleSuccess = data => {
        return JSON.stringify(data);
    };

    if (!stocksEndpoint) return handleError('Stocks Endopint not set.', 'Ops... Ocorreu um erro.');
    if (!stock) return handleError('Stock is required', 'Por favor preencha o código da ação.');

    let url = `${stocksEndpoint}stock/analysis/`;

    request(url, (err, response, body) => {
        let errorMessage = 'Ops... Ocorreu um erro na API de Ações.';
        if (response.statusCode !== 200) return handleError('Error at Stocks API', errorMessage);
        if (err) return handleError(err.message, errorMessage);
        return handleSuccess(body);
    });
}

module.exports = getStockAnalysis;
