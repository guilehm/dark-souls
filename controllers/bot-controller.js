const Discord = require('discord.js');
const logger = require('heroku-logger');

const token = process.env.DISCORD_TOKEN;

const getUserStats = require('../helpers/get-user-stats');
const getUserStatsTracker = require('../helpers/get-user-stats-tracker');
const getStockAnalysis = require('../helpers/get-stocks-analysis');
const {
    createEmbedForStats,
    createEmbedForStatsTracker,
    createHelperEmbed,
} = require('../helpers/create-embeds');

const randomColor = require('random-color');

const client = new Discord.Client();

module.exports = (req, res) => {

    client.on('ready', (msg) => {
        client.channels.find(c => c.name === 'parça-bot-testes')
            .send('Acordei');
        client.user.setActivity('Netflix', { type: 'WATCHING' });
    });

    client.on('message', async (msg) => {
        let handleError = (err) => {
            msg.channel.send('Ops...ocorreu um erro, tente novamente!');
            let error = '';
            try {
                error = JSON.stringify(err);
            } catch (e) {
                error = err;
            }
            logger.error(error);
        };
        let handleResponse = (data) => {
            if (!data.kills) {
                msg.channel.send('Ops...ocorreu um erro ao comunicar com a API, tente novamente!\n\t' +
                    '*A API da v2 está instável, utilize a v1.*\n' +
                    '*Se precisar de ajuda digite* `.h`');
                logger.error(`Error handling response for data: ${JSON.stringify(data)}`);
            } else {
                msg.channel.send(createEmbedForStats(data));
            }
        };
        let handleResponseTracker = (data) => {
            let stats = data;
            if (!stats.currentSeason) {
                msg.channel.send('Ops...ocorreu um erro na API do Fortnite Tracker, tente novamente!!');
                logger.error(`Error handling response for data: ${JSON.stringify(data)}`);
            } else {
                let embeds = createEmbedForStatsTracker(stats);
                msg.channel.send(embeds[0]);
                msg.channel.send(embeds[1]);
            }
        };

        if (msg.content === '.ping') {
            msg.channel.startTyping();
            msg.channel.send(`Oi, ${msg.author}, estou conectado!`);
            msg.channel.stopTyping();
        }

        if (msg.content.startsWith('.s ')) {
            msg.channel.startTyping();
            let [, username, platform] = msg.content.split(' ');
            if (!platform) {
                await getUserStats(username, req).then(handleResponse, handleError);
            } else {
                await getUserStatsTracker(username, platform).then(handleResponseTracker, handleError);
            }
            msg.channel.stopTyping();
        }

        if (msg.content.startsWith('.a ')) {
            msg.channel.startTyping();
            let [, stock] = msg.content.split(' ');
            if (!stock) {
                msg.channel.send(`${msg.author}, digite o código da ação corretamente!`);
            } else {
                let handleAnalysisResponse = data => {
                    let emb = new Discord.RichEmbed();
                    let color = randomColor();
                    emb.setColor(color.hexString());
                    emb.setTitle(data.Nome);    
                    emb.setDescription(data.Características || '');
                    for (let field of Object.keys(data)) {
                        if (field !== 'Nome' || field !== 'Características'){
                            emb.addField(field, data[field]);
                        }
                    }
                    msg.channel.send(emb);
                };
                stockData = await getStockAnalysis(stock)
                    .then(handleAnalysisResponse)
                    .catch(handleAnalysisResponse);
            }
            msg.channel.stopTyping();
        }

        if (msg.content.startsWith('.h')) {
            msg.channel.startTyping();
            let embed = createHelperEmbed();
            msg.channel.send(embed);
            msg.channel.stopTyping();
        }
    });

    client.login(token);
    res.status(200).end(JSON.stringify({
        mensagem: 'Bot acordado com sucesso'
    }));
};