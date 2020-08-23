const events = require('events');

const config = require('../config.json');
const Query = require('./query');
const Log = require('./log');

class LongPoll extends events.EventEmitter {

    constructor(timeout = 25) {
        super();
        this.groupId = config.groupId;
        this.timeout = timeout;
        this.log = new Log('LongPoll');
    }

    emitError(error) {
        this.emit('error', new Error(error));
    };

    getConfigLongPoll(server, key, ts) {
        return `${server}?act=a_check&key=${key}&ts=${ts}&wait=${this.timeout}`;
    }

    async update(server, key, ts) {

        const urlLongPollServer = this.getConfigLongPoll(server, key, ts);
        const query = await Query.request.get(urlLongPollServer);
        if (query === null || query === undefined) return this.emitError("Ошибка во время получения события LongPoll от API ВКонтакте");
        const responseLongPull = JSON.parse(query);

        if (responseLongPull['failed']) {
            this.emit('error', responseLongPull);
            return this.listen();
        }

        ts = responseLongPull['ts'];
        this.emit('update', responseLongPull);
        await this.update(server, key, ts);
    }

    async watch() {
        const query = await Query.get('groups.getLongPollServer', {'group_id': this.groupId});
        if (query === null || query === undefined) return this.emitError("Ошибка во время выполнения запроса к методу ВКонтакте.");
        const response = JSON.parse(query);
        if (response['error'] != null) return this.emit('error', response);

        const key = response['response']['key'];
        const server = response['response']['server'];
        const ts = response['response']['ts'];

        await this.update(server, key, ts);
    }
}

module.exports = LongPoll;