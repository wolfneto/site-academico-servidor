module.exports = (app) => {
    app.get('/health', (req, res) => {
        res.status(200).send({
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    });

    return this;
}