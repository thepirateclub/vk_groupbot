class CommandProcessing {
    static controllers = new Map();

    static setControllers(controllers) {
        CommandProcessing.controllers = controllers;
    }
    static findCommand(events) {
        const updates = events?.updates;
        if (updates !== undefined) {
            for (const update of updates) {
                const textMessage = update?.object?.message?.text;
                if (textMessage === undefined) break;
                for (const [name, controller] of CommandProcessing.controllers) {
                    if (textMessage.indexOf(controller.textCommand) > -1) {
                        const _class = new controller();
                        _class.execute(update);
                    }
                }
            }
        }
    }
}

module.exports = CommandProcessing;