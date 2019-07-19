const Discord = require('discord.js')
const token = process.env.DISCORD_TOKEN

const getUserStats = require('../helpers/get-user-stats')
const getUserStatsTracker = require('../helpers/get-user-stats-tracker')

const client = new Discord.Client()

module.exports = (req, res) => {

    client.on('ready', (msg) => {
        client.channels.find(c => c.name === 'parça-bot-testes')
            .send('Acordei')
    })

    client.on('message', async (msg) => {
        let handleError = () => {
            msg.channel.send('Deu bosta, tente novamente!')
        }
        let handleResponse = (data) => {
            if (!data.vitorias) {
                msg.channel.send('Deu bosta, tente novamente!')
            } else {
                msg.channel.send(createEmbedFortStats(data))
            }
        }
        let handleResponseTracker = (data) => {
            let stats = data
            if (!stats.currentSeason) {
                msg.channel.send('Deu bosta, tente novamente!!')
            } else {
                let embeds = createEmbedFortStatsTracker(stats)
                msg.channel.send(embeds[0])
                msg.channel.send(embeds[1])
            }
        }

        if (msg.content === '.ping') {
            msg.channel.startTyping()
            msg.channel.send(`Oi, ${msg.author}, estou conectado!`)
            msg.channel.stopTyping()
        }

        if (msg.content.startsWith('.s ')) {
            msg.channel.startTyping()
            let [, username, platform] = msg.content.split(' ')
            if (!platform) {
                await getUserStats(username).then(handleResponse, handleError)
            } else {
                await getUserStatsTracker(username, platform).then(handleResponseTracker, handleError)
            }
            msg.channel.stopTyping()
        }

        if ((msg.content.startsWith('.h') || msg.content.startsWith('.a'))) {
            msg.channel.startTyping()
            let embed = createHelperEmbed()
            msg.channel.send(embed)
            msg.channel.stopTyping()
        }
    })

    client.login(token)
    res.status(200).end(JSON.stringify({
        mensagem: 'Bot acordado com sucesso'
    }))
}