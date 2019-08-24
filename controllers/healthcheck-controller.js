module.exports = (req, res) => {
    let message = "bot is healthy";
    console.log(message);
    res.status(200).end(JSON.stringify({
        message
    }));
};