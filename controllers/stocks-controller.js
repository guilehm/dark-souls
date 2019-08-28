const request = require('request');
const logger = require('heroku-logger');


module.exports = async (req, res) => {
    const stocksEndpoint = process.env.STOCKS_ENDPOINT;
    let stock = req.query.stock;

    let handleError = (error, message) => {
        logger.error(error);
        return res.end(JSON.stringify({
            error: true,
            message: message,
        }));
        
    };

    let handleSuccess = data => {
        return res.end(JSON.stringify(data));
    };

    if (!stocksEndpoint) return handleError('Stocks Endopint not set.', 'Ops... Ocorreu um erro.');
    if (!stock) return handleError('Stock is required', 'Por favor preencha o código da ação.');

    let url = `${stocksEndpoint}stock/analysis/`;
    request(url, (err, response, body) => {
        if (response.statusCode !== 200){
            return handleError('Error at Stocks API', 'Ops.. Ocorreu um erro na API de Ações.');
        }
        return handleSuccess(body);
    });

};
