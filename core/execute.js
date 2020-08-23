const Log = require('./log');
const Query = require('./query')

/**
 * Данный класс реализует метод Execute API ВКонтакте
 * Принимая на вход VKScript полученный из класса VkScript
 */
class Execute {

    static log = new Log("Execute");
    static query = Query;

    static async execute(vkScript) {
        const response = await Query.get('execute', {'code': vkScript});
        if (response === null) throw new Error(`Ошибка во время выполнения метода Execute: ${JSON.stringify(response)}`);
        const jsonResponse = JSON.parse(response);
        if (jsonResponse['error'] !== null) Execute.log.error(jsonResponse);
        return jsonResponse;
    }
}

module.exports = Execute;
