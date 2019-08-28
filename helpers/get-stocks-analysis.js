const request = require('request');
const logger = require('heroku-logger');


async function getStockAnalysis(stock) {
    const stocksEndpoint = process.env.STOCKS_ENDPOINT;


    return new Promise((resolve, reject) => {

        let url = `${stocksEndpoint}stocks/${stock}/analysis/`;

        request(url, (err, response, body) => {
            let errorMessage = 'Ops... Ocorreu um erro na API de Ações.';
            if (err) reject(err.message);
            if (response.statusCode === 404) reject('Ação não encontrada!');
            if (response.statusCode !== 200) reject(errorMessage);
            try {
                parsedData = JSON.parse(body);
            } catch (e) {
                resolve(errorMessage);
            }
            resolve(parsedData.company);
        });
    });
}

module.exports = getStockAnalysis;
