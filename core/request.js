const https = require('https');

class Request {
    agent = null;
    constructor(options) {
        this.agent = new https.Agent(options);
    }

    get(url) {
        let options = {agent: this.agent, method: 'GET'};
        return new Promise((resolve, reject) => {
            const request = https.request(url, options, (res) => {
                res.on('error', (err) => {
                    reject(err);
                });

                let streamData = "";
                res.on('data', (chunk) => {
                    streamData += chunk;
                })

                res.on('end', () => {
                    resolve(streamData);
                })
            });

            request.on('error', (err) => {
                reject(err);
            })

            request.end();
        });
    }

}

module.exports = Request;