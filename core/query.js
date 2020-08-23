const querystring = require('querystring');
const config = require('../config.json');
const Request = require('./request');

class Query {
    static host = "https://api.vk.com/method";
    static request = new Request();
    static token = config.token;
    static version = config.version;

    static get(method, params) {
        const url = `${Query.host}/${method}?${querystring.encode(params)}&access_token=${Query.token}&v=${Query.version}`;
        return Query.request.get(url);
    }
}

module.exports = Query;