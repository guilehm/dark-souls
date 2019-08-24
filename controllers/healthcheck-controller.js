module.exports = (req, res) => {
    let message = "bot is healthy";
    res.status(200).end(JSON.stringify({
        message
    }));
};