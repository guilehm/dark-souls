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

function sendLog(msg) {
    client.channels
        .find(c => c.name === 'dark-souls-logs-debug')
        .send(`${msg.author} asking: ${msg.content}`);
}


async function sendDelayedMessage(msg, content, delay, lastDelay, reaction) {
    msg.channel.startTyping();
    await new Promise((resolve) => setTimeout(resolve, delay));
    msg.channel.send(content).then((m) => {
        if (reaction) {
            setTimeout(() => m.react(reaction), delay);
        }
    });
    msg.channel.stopTyping();
    await new Promise((resolve) => setTimeout(resolve, lastDelay));
}

module.exports = (req, res) => {

    client.on('ready', (msg) => {
        client.channels.find(c => c.name === 'teste-private')
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
            sendLog(msg);
            msg.channel.startTyping();
            msg.channel.send(`Oi, ${msg.author}, estou conectado!`);
            msg.channel.stopTyping();
        }

        if (msg.content.startsWith('.s ')) {
            sendLog(msg);
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
            sendLog(msg);
            msg.channel.startTyping();
            let [, stock] = msg.content.split(' ');
            if (!stock) {
                msg.channel.send(`${msg.author}, digite o código da ação corretamente!`);
            } else {
                let handleAnalysisError = err => {
                    msg.channel.send(new Discord.RichEmbed().setTitle(err));
                };

                let handleAnalysisResponse = data => {
                    let emb = new Discord.RichEmbed();
                    let color = randomColor();
                    let companyData = data.company;
                    let governanceData = data.governance;
                    emb.setColor(color.hexString());
                    emb.setTitle(companyData.Nome);
                    emb.setDescription(companyData.Características || '');
                    for (let field of Object.keys(companyData)) {
                        if (field !== 'Nome' && field !== 'Características' && field !== 'Site B3') {
                            emb.addField(field, companyData[field], true);
                        }
                    }
                    emb.addField('Reclame Aqui', governanceData['Reclame Aqui'], true);
                    emb.addField('Sócio majoritário', governanceData['Sócio Majoritário'], true);
                    emb.addField('Análise', `https://${data.video}`);
                    emb.addField('Site B3', companyData['Site B3']);
                    // emb.addField('Gráfico', data.chart);
                    emb.setThumbnail(data.logo);
                    emb.setFooter('https://github.com/Guilehm/stocks-crawler', 'https://avatars2.githubusercontent.com/u/33688752');
                    msg.channel.send(emb);

                };
                stockData = await getStockAnalysis(stock)
                    .then(handleAnalysisResponse)
                    .catch(handleAnalysisError);
            }
            msg.channel.stopTyping();
        }

        if (msg.content.startsWith('.h')) {
            sendLog(msg);
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
