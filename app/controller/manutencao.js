module.exports = (app) => {
    const https = require('node:https');
    const crypto = app.utils.crypto;

    const manutencaoModel = app.orm_model.manutencao;
    const sourceUrl = process.env.MANUTENCAO_SOURCE_URL || 'https://cris-servidor-production.up.railway.app/manutencao/getManutencao';

    const getRemoteManutencao = (url) => new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    return reject(new Error(`Remote status ${response.statusCode}`));
                }
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (error) {
                    reject(error);
                }
            });
        });

        request.setTimeout(5000, () => {
            request.destroy(new Error('Remote timeout'));
        });

        request.on('error', (error) => {
            reject(error);
        });
    });

    this.getManutencao = async function (req, res) {
        try {
            try {
                const remote = await getRemoteManutencao(sourceUrl);
                if (remote?.manutencao !== undefined) {
                    return res.send(crypto.encrypt(remote, true));
                }
            } catch (error) {
                console.log('[manutencao] remote source unavailable:', error.message);
            }

            let manutencao = await manutencaoModel.manutencao.findOne({});

            if (!manutencao) {
                manutencao = await manutencaoModel.manutencao.create({
                    manutencao: 0,
                    msg_manutencao: ''
                });
            }

            const payload = manutencao?.dataValues || manutencao;
            res.send(crypto.encrypt(payload, true));
        } catch (error) {
            console.log(error);
            const fallback = {
                id: 1,
                manutencao: 0,
                msg_manutencao: ''
            };
            res.send(crypto.encrypt(fallback, true));
        }
    }

    return this;
}