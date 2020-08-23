const EventController = require("./eventController");
const Log = require('../core/log');
const Query = require('../core/query');

class TestController extends EventController {

    constructor() {
        super();
        this.log = new Log(this.constructor.name);
    }

    execute(update) {
        this.log.info(update);
    }
}

module.exports = TestController;