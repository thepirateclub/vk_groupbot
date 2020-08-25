const fs = require('fs');
const Path = require('path');

class VkScript {
    static list = new Map()

    static load(path) {
        const dirents = fs.opendirSync(Path.resolve(path));
        let dir = null, scripts = [];
        while((dir = dirents.readSync()) !== null) {
            const file = fs.readFileSync(Path.resolve(path, dir.name));
            VkScript.list.set(dir.name, file.toString());
        }
        dirents.close();
    }

    static getScript(name, params = null) {
        const file = VkScript.list.get(name + '.txt');
        if (file === null) throw new Error("Скрипт: " + name + " не найден!");
        return VkScript.checkVariable(params, file);
    }

    static checkVariable(params = null, file = null) {
        if (params === null && file == null) return file;
        const pattern = new RegExp('#(?<variable>.*)#', 'igm');
        const paramsKeys = Object.keys(params);

        let match = null, count = 0;
        while ((match = pattern.exec(file)) !== null) {
            const key = match[1];
            if (!paramsKeys.includes(key)) throw new Error(`В параметрах отсутствует переменная ${key}`);
        }
        return VkScript.compileScript(params, file, pattern);
    }

    static compileScript(params = null, file = null, pattern = null) {

        if (params === null) throw new Error(`Отсутствуют параметры: params = ${JSON.stringify(params)}`);
        if (file === null) throw new Error(`Не указан файл: file = ${file}`);
        if (pattern === null) throw new Error(`Не был передан RegExp: ${JSON.stringify({pattern: pattern})}`);

        return pattern[Symbol.replace](file, (match, variableName) => {
            return params[variableName];
        });
    }
}

module.exports = VkScript;