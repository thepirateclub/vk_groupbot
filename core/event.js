const event = require('events');

class Event extends event.EventEmitter {
    constructor() {
        super();
    }

    connectionToEventService(eventService, eventType, transportFunction) {
        eventService.on(eventType, (event) => {
            transportFunction(event, this);
        });
    }

    subscribeOnEvent(event, _class, method) {
        this.on(event, (e) => {
            _class.emit(event, method(e));
        });
    }
}

module.exports = Event;