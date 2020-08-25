const Path = require('path');
const fs = require('fs');

class Controllers {

    constructor() {
        this.list = new Map();
    }

    /**
     * Получение списка файлов из указанной папки
     * Загрузка каждого файла, кроме eventController.js
     * Добавление имени класса в файле, как ключ, а сам файл как значение
    */
    load(path) {
        const dirents = fs.opendirSync(Path.resolve(path));
        let dir = null;
        while((dir = dirents.readSync()) !== null) {
            if (dir.name !== 'eventController.js') {
                console.log(Path.resolve(path, dir.name));
                let controller = require(Path.resolve(path, dir.name));
                if (controller.name === undefined) throw Error(`Класс контроллера ${dir.name} не найден, проверьте экспорт класса!`);
                this.list.set(controller.name, controller);
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
    setAllControllerEvent(eventService, event, middleware = null) {
        for (const [name, controller] of this.getControllers()) {
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
    setControllerEvent(name, eventService, event, middleware = null) {
        const controller = this.getController(name);
        const _class = new controller();

        if (middleware !== null) {
            eventService.subscribeOnEvent(event, _class, middleware.bind(_class));
        } else {
            eventService.subscribeOnEvent(event, _class, _class.execute.bind(_class));
        }
    }

    getController(name) {
        return this.list.get(name);
    }

    getControllerByTextCommand(textCommand) {
        for (const [name, controller] of this.list) {
            if (controller.textCommand === null) continue;
            if (controller.textCommand === textCommand) return controller;
        }

        return null;
    }

    /**
     * Возвращает список контроллеров
     * @return {Map}
     */
    getControllers() {
        return this.list;
    }
}

module.exports = Controllers;