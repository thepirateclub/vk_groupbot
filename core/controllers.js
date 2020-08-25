const Path = require('path');
const fs = require('fs');

class Controllers {
    static list = new Map();

    /**
     * Получение списка файлов из указанной папки
     * Загрузка каждого файла, кроме eventController.js
     * Добавление имени класса в файле, как ключ, а сам файл как значение
    */
    static load(path) {
        const dirents = fs.opendirSync(Path.resolve(path));
        let dir = null;
        while((dir = dirents.readSync()) !== null) {
            if (dir.name !== 'eventController.js') {
                console.log(Path.resolve(path, dir.name));
                let controller = require(Path.resolve(path, dir.name));
                if (controller.name === undefined) throw Error(`Класс контроллера ${dir.name} не найден, проверьте экспорт класса!`);
                Controllers.list.set(controller.name, controller);
            }
        }

        dirents.close();
    }

    /**
     * Подписка на получение событий всеми контроллерами
     * @param eventService
     * @param event
     * @param middleware - промежуточная функция, для обработки события
     */
    static setAllControllerEvent(eventService, event, middleware = null) {
        for (const [name, controller] of Controllers.getControllers()) {
            const _class = new controller();
            if (middleware !== null) {
                eventService.subscribeOnEvent(event, _class, middleware.bind(_class));
            } else {
                eventService.subscribeOnEvent(event, _class, _class.execute.bind(_class));
            }
        }
    }

    /**
     * Подписка на получение событий конкретным контроллером
     * @param name
     * @param eventService
     * @param event
     * @param middleware - промежуточная функция, для обработки события
     */
    static setControllerEvent(name, eventService, event, middleware = null) {
        const controller = Controllers.getController(name);
        const _class = new controller();

        if (middleware !== null) {
            eventService.subscribeOnEvent(event, _class, middleware.bind(_class));
        } else {
            eventService.subscribeOnEvent(event, _class, _class.execute.bind(_class));
        }
    }

    static getController(name) {
        return Controllers.list.get(name);
    }

    static getControllerByTextCommand(textCommand) {
        for (const [name, controller] of Controllers.list) {
            if (controller.textCommand === null) continue;
            if (controller.textCommand === textCommand) return controller;
        }

        return null;
    }

    /**
     * Возвращает список контроллеров
     * @return {Map}
     */
    static getControllers() {
        return Controllers.list;
    }
}

module.exports = Controllers;