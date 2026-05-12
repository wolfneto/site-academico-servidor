module.exports = (app) => {
    app.get('/health', async (req, res) => {
        let databaseConnection = 'unknown';

        try {
            await app.database.db.sequelize.authenticate();
            databaseConnection = 'ok';
        } catch (error) {
            databaseConnection = 'error';
        }

        res.status(databaseConnection === 'ok' ? 200 : 503).send({
            status: databaseConnection === 'ok' ? 'ok' : 'degraded',
            database_connection: databaseConnection,
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    });

    return this;
}