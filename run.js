const LongPoll = require('./core/longPoll');
const Log = require('./core/log');
const Controllers = require('./core/controllers');
const VkScript = require("./core/vkScript");
const Event = require('./core/event');
const EventType = require('./core/eventType');
const CommandProcessing = require('./middleware/commandProcessing');

const log = new Log('system');

const event = new Event();
const longPoll = new LongPoll(60);

Controllers.load('controllers');
log.info("Загружено контроллеров: " + Controllers.list.size);

Controllers.setAllControllerEvent(event, EventType.MessageNew, CommandProcessing.findCommand);
log.info("Все контроллеры подписаны на получения новых сообщений");

VkScript.load('scripts');
log.info("Загружено скриптов: " + VkScript.list.size);

event.connectionToEventService(longPoll, 'update', function (event, context) {
    if (event?.updates) for (const update of event.updates) if (update?.type) context.emit(update.type, event);
});
log.info("Подключение к событийной модели LongPoll...");

longPoll.watch();
log.info("Бот запущен...")