const Discord = require('discord.js')
const token = process.env.DISCORD_TOKEN

const getUserStats = require('../helpers/get-user-stats')
const getUserStatsTracker = require('../helpers/get-user-stats-tracker')

const client = new Discord.Client()

function createEmbedFortStats(data) {
    let embed = new Discord.RichEmbed()
        .setTitle(`${data.username}`)
        .setColor('BLURPLE')
        .setDescription(`Veja aqui o os resultados do player ${data.username} (v2)`, true)
        .setThumbnail('https://files.cults3d.com/uploaders/13716176/illustration-file/7759eeab-41c2-458e-a444-39c5c5e43334/Fortnite_large.jpg')
        .addBlankField()
        .addField('kills', data.kills || '-', true)
        .addField('vitórias', data.vitorias || '-', true)
        .addField('kd', data.kd || '-', true)
        .addField('partidas', data.partidas || '-', true)
        .setTimestamp()
        .setFooter('https://investir-xp-node.herokuapp.com/', 'https://investir-xp-node.herokuapp.com/')
    return embed
}

function createEmbedFortStatsTracker(data) {
    let kd = data.currentSeason.kd.total
    kd = kd > 1 ? kd.toFixed(2) + ' 😱' : kd.toFixed(2)

    let kdLifetime = data.lifeTime.kd.total
    kdLifetime = kdLifetime > 1 ? kdLifetime.toFixed(2) + ' 😱' : kdLifetime.toFixed(2)

    let embed = new Discord.RichEmbed()
        .setTitle(`${data.username}`)
        .setColor('BLURPLE')
        .setDescription(`Veja aqui o os resultados do player ${data.username} (v1)`, true)
        .addBlankField()     
        .addField('TEMPORADA ATUAL', 'dados da temporada atual')
        .addField('kills', data.currentSeason.kills.total || '-', true)
        .addField('vitórias', data.currentSeason.wins.total || '-', true)
        .addField('kd', kd || '-', true)
        .addField('partidas', data.currentSeason.matches.total || '-', true)
        .setTimestamp()
        .setFooter('https://investir-xp-node.herokuapp.com/', 'https://investir-xp-node.herokuapp.com/')

    let embedLifetime = new Discord.RichEmbed()
        .setTitle(`${data.username}`)
        .setColor('BLURPLE')
        .setDescription(`Veja aqui o os resultados do player ${data.username} (v1)`, true)
        .addBlankField()
        .addField('GERAL', 'dados de todas as temporadas')
        .addField('kills', data.lifeTime.kills.total || '-', true)
        .addField('vitórias', data.lifeTime.wins.total || '-', true)
        .addField('kd', kdLifetime  || '-', true)
        .addField('partidas', data.lifeTime.matches.total || '-', true)
        .setTimestamp()
        .setFooter('https://investir-xp-node.herokuapp.com/', 'https://investir-xp-node.herokuapp.com/')
    return [embed, embedLifetime]
}

function createHelperEmbed() {
    return new Discord.RichEmbed()
        .setTitle(`Comandos`)
        .setColor('#0099ff')
        .setDescription(`lista dos comandos do BOT`, true)
        .addBlankField()     
        .addField('Status V1', 'digite: ```.s <nome-do-usuario> <plataforma>```')
        .addField('Status V2 (instável)', 'digite: ```.s <nome-do-usuario>```')
        .addField('Ping', 'digite: ```.s ping```')
        .addField('Acordar', 'Caso eu esteja dormindo, digite: ```.acordar```')
        .setTimestamp()
        .setFooter('https://investir-xp-node.herokuapp.com/', 'https://investir-xp-node.herokuapp.com/')
}
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