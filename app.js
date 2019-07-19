const Discord = require('discord.js')
const token = process.env.DISCORD_TOKEN

const client = new Discord.Client()

client.on('message', (msg) => {
    if (msg.content === '.ping') {
        msg.channel.send(`Oi, ${msg.author}, estou conectado!`)
    }
})

client.login(token)