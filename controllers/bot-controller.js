const Discord = require('discord.js')
const token = process.env.DISCORD_TOKEN

const getUserStats = require('../helpers/get-user-stats')

const client = new Discord.Client()

module.exports = (req, res) => {

    client.on('ready', (msg) => {
        client.channels.find(c => c.name === 'geral')
            .send('Acordei')
    })

    client.on('message', async (msg) => {
        let handleResponse = data => {
            let stats = data
            if (!stats.vitorias) {
                msg.channel.send('Deu bosta, tente novamente!')
            } else {
                let response = `
                    kills: ${stats.kills}\nvitórias: ${stats.vitorias}\nkd: ${stats.kd}\npartidas: ${stats.partidas}`
                msg.channel.send(response)
            }
        }

        if (msg.content === '.ping') {
            msg.channel.send(`Oi, ${msg.author}, estou conectado!`)
        }

        if (msg.content.startsWith('.s ')) {
            let username = msg.content.split(' ').pop()
            await getUserStats(username).then(handleResponse, handleResponse)
        }
    })

    client.login(token)
    res.status(200).end(JSON.stringify({
        mensagem: 'Bot acordado com sucesso'
    }))
}