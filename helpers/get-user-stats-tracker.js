const request = require('request')


async function getUserStatsTracker(username, platform) {

    const trackerApi = 'https://api.fortnitetracker.com/v1/profile'
    const trackerApiToken = process.env.TRACKER_STATS_TOKEN

    let url = `${trackerApi}/${platform}/${username}/`

    let options = {
        url: url,
        headers: { 'TRN-Api-Key': trackerApiToken },
    }

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) reject(error)
             try {
                data = JSON.parse(body)
                let parsedData = parseData(data)
                resolve(parsedData)
            } catch (err) {
                reject(err)
            }
        })
    })
}

module.exports = getUserStatsTracker
