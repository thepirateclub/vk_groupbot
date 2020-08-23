class Util {
    /**
     * Генератор 32 битного псевдослучайного числа
     * @return {string}
     */
    static generateRandomInt32() {
        const int16A = Math.round(Math.random() * (Number.MAX_SAFE_INTEGER - 1111111111111111));
        const int16B = Math.round(Math.random() * (Number.MAX_SAFE_INTEGER - 1111111111111111));
        return `${int16A}${int16B}`;
    }
}

module.exports = Util;