const request = require('request')


async function getUserStats(username) {

    const cleanStatsApi = process.env.CLEAN_STATS_API

    let options = {
        url: cleanStatsApi,
        qs: { username: username},
    }
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) reject(error)
            try {
                data = JSON.parse(body)
            } catch (err) {
                reject(err)
            }
            data.username = username
            resolve(data)
        })
    })
}

module.exports = getUserStats
