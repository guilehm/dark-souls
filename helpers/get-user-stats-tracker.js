const request = require('request');

function parseData(data) {
    let solo = data.stats.p2;
    let duo = data.stats.p10;
    let squad = data.stats.p9;

    let currentSolo = data.stats.curr_p2;
    let currentDuo = data.stats.curr_p10;
    let currentSquad = data.stats.curr_p9;

    let addTotals = stats => {
        let wins = stats.currentSeason.wins;
        stats.currentSeason.wins.total = wins.solo + wins.duo + wins.squad;
        let matches = stats.currentSeason.matches;
        stats.currentSeason.matches.total = matches.solo + matches.duo + matches.squad;
        let kills = stats.currentSeason.kills;
        stats.currentSeason.kills.total = kills.solo + kills.duo + kills.squad;
        let kd = stats.currentSeason.kd;
        stats.currentSeason.kd.total = (kd.solo + kd.duo + kd.squad) / 3;

        let winsLifetime = stats.lifeTime.wins;
        stats.lifeTime.wins.total = winsLifetime.solo + winsLifetime.duo + winsLifetime.squad;
        let matchesLifetime = stats.lifeTime.matches;
        stats.lifeTime.matches.total = matchesLifetime.solo + matchesLifetime.duo + matchesLifetime.squad;
        let killsLifetime = stats.lifeTime.kills;
        stats.lifeTime.kills.total = killsLifetime.solo + killsLifetime.duo + killsLifetime.squad;
        let kdLifetime = stats.lifeTime.kd;
        stats.lifeTime.kd.total = (kdLifetime.solo + kdLifetime.duo + kdLifetime.squad) / 3;
        return stats;
    };

    let stats = {
        username: data.epicUserHandle,
        currentSeason: {
            wins: {
                solo: currentSolo.top1.valueInt,
                duo: currentDuo.top1.valueInt,
                squad: currentSquad.top1.valueInt,
            },
            matches: {
                solo: currentSolo.matches.valueInt,
                duo: currentDuo.matches.valueInt,
                squad: currentSquad.matches.valueInt,
            },
            kills: {
                solo: currentSolo.kills.valueInt,
                duo: currentDuo.kills.valueInt,
                squad: currentSquad.kills.valueInt,
            },
            kd: {
                solo: currentSolo.kd.valueDec,
                duo: currentDuo.kd.valueDec,
                squad: currentSquad.kd.valueDec,
            },
        },
        lifeTime: {
            wins: {
                solo: solo.top1.valueInt,
                duo: duo.top1.valueInt,
                squad: squad.top1.valueInt,
            },
            matches: {
                solo: solo.matches.valueInt,
                duo: duo.matches.valueInt,
                squad: squad.matches.valueInt,
            },
            kills: {
                solo: solo.kills.valueInt,
                duo: duo.kills.valueInt,
                squad: squad.kills.valueInt,
            },
            kd: {
                solo: solo.kd.valueDec,
                duo: duo.kd.valueDec,
                squad: squad.kd.valueDec,
            },
        },
    }
    return addTotals(stats)
}

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
