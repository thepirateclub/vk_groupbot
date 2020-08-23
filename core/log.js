const util = require('util');

class Log {
    name = null;
    options = {showHidden: false, depth: 10, colors: true, compact: true, breakLength: Infinity};
    constructor(name, options = null) {
        this.name = name;
        if (options != null) {
            this.options = options;
        }
    }

    getLabelDateTime() {
        const date = new Date();
        let month = date.getMonth() < 12? date.getMonth() + 1: 1;
        month = month < 10? '0' + month: month;
        const hours = date.getHours() < 10? '0' + date.getHours(): date.getHours();
        const seconds = date.getSeconds() < 10? '0' + date.getSeconds(): date.getSeconds();
        const minutes = date.getMinutes() < 10? '0' + date.getMinutes(): date.getMinutes();

        return `${date.getDate()}-${month}-${date.getFullYear()} ${hours}:${minutes}:${seconds}`
    }

    info(text) {
        console.log('['+ this.name + '][' + this.getLabelDateTime() + ']: ' + util.inspect(text, this.options));
    }

    error(text) {
        console.error('['+ this.name + ']['+ this.getLabelDateTime() + ']: ' + util.inspect(text, this.options));
    }

}

module.exports = Log;