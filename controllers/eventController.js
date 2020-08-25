const event = require('events');

const Log = require('../core/log');

class EventController extends event.EventEmitter{
    // Команда на которую реагирует бот
    static textCommand = null;

    constructor() {
        super();
        this.log = new Log("EventController");
        this.event = new event.EventEmitter();
    }

    execute(update) {
        this.log.error("Метод не реализован");
    }
}

module.exports = EventController;