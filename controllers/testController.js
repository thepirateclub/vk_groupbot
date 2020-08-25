const EventController = require("./eventController");
const Log = require('../core/log');
const VkScript = require('../core/vkScript');
const Util = require('../core/util');
const Query = require('../core/query');

class TestController extends EventController {

    static textCommand = 'тест';

    constructor() {
        super();
        this.log = new Log(this.constructor.name);
    }

    async execute(update) {
        const fromId = update?.object?.message?.from_id;
        if (fromId !== undefined) {
            const vkScript = VkScript.getScript('messages_repeat',{'userId': fromId, 'randomId':Util.generateRandomInt32()});
            const response = await Query.get('execute', {'code': vkScript});
            if (response === null) return this.log.error("Ошибка при выполнении запроса к методу API ВКонтакте.");

            const json = JSON.parse(response);
            if (json['execute_errors'] !== undefined) {
                this.log.error(response);
            } else {
                this.log.info("10 сообщений было отправлено, скрипт выполнен!");
            }
        }
    }
}

module.exports = TestController;