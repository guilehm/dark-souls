const Discord = require('discord.js')

function createEmbedForStats(data) {
    let embed = new Discord.RichEmbed()
        .setTitle(`**${data.username}**`)
        .setColor('BLURPLE')
        .setDescription(`Veja aqui o os resultados do player ${data.username} (v2)`, true)
        .setThumbnail('https://files.cults3d.com/uploaders/13716176/illustration-file/7759eeab-41c2-458e-a444-39c5c5e43334/Fortnite_large.jpg')
        .addBlankField()
        .addField('**kills**', data.kills || '-', true)
        .addField('**vitórias**', data.vitorias || '-', true)
        .addField('**kd**', data.kd || '-', true)
        .addField('**partidas**', data.partidas || '-', true)
        .setTimestamp()
        .setFooter('https://investir-xp-node.herokuapp.com/', 'https://investir-xp-node.herokuapp.com/')
    return embed
}

function createEmbedForStatsTracker(data) {
    let kd = data.currentSeason.kd.total
    kd = kd > 1 ? kd.toFixed(2) + ' 😱' : kd.toFixed(2)

    let kdLifetime = data.lifeTime.kd.total
    kdLifetime = kdLifetime > 1 ? kdLifetime.toFixed(2) + ' 😱' : kdLifetime.toFixed(2)

    let embed = new Discord.RichEmbed()
        .setTitle(`**${data.username}**`)
        .setColor('BLURPLE')
        .setDescription(`Veja aqui o os resultados do player ${data.username} (v1)`, true)
        .addBlankField()
        .addField('**TEMPORADA ATUAL**', 'dados da temporada atual')
        .addField('**kills**', data.currentSeason.kills.total || '-', true)
        .addField('**vitórias**', data.currentSeason.wins.total || '-', true)
        .addField('**kd**', kd || '-', true)
        .addField('**partidas**', data.currentSeason.matches.total || '-', true)
        .setTimestamp()
        .setFooter('https://investir-xp-node.herokuapp.com/', 'https://investir-xp-node.herokuapp.com/')

    let embedLifetime = new Discord.RichEmbed()
        .setTitle(`**${data.username}**`)
        .setColor('BLURPLE')
        .setDescription(`Veja aqui o os resultados do player ${data.username} (v1)`, true)
        .addBlankField()
        .addField('**GERAL**', 'dados de todas as temporadas')
        .addField('**kills**', data.lifeTime.kills.total || '-', true)
        .addField('**vitórias**', data.lifeTime.wins.total || '-', true)
        .addField('**kd**', kdLifetime || '-', true)
        .addField('**partidas**', data.lifeTime.matches.total || '-', true)
        .setTimestamp()
        .setFooter('https://investir-xp-node.herokuapp.com/', 'https://investir-xp-node.herokuapp.com/')
    return [embed, embedLifetime]
}

function createHelperEmbed() {
    return new Discord.RichEmbed()
        .setTitle(`**Comandos**`)
        .setColor('#0099ff')
        .setDescription(`lista dos comandos do BOT`, true)
        .addBlankField()
        .addField('Status V1', 'digite: ```.s <nome-do-usuario> <plataforma>```')
        .addField('Status V2 (instável)', 'digite: ```.s <nome-do-usuario>```')
        .addField('Ping', 'digite: ```.ping```')
        .addField('Acordar', 'Caso eu esteja dormindo, digite: ```.acordar```')
        .setTimestamp()
        .setFooter('https://investir-xp-node.herokuapp.com/', 'https://investir-xp-node.herokuapp.com/')
}

module.exports = {
    createEmbedForStats,
    createEmbedForStatsTracker,
    createHelperEmbed,
}
