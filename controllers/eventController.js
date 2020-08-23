const event = require('events');

const Log = require('../core/log');

class EventController extends event.EventEmitter{
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