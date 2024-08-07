const handlePing = async (req, res) => {
    res.status(200).json({ ping: "ping"});
}

module.exports = { handlePing };