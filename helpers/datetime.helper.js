const moment = require('moment-timezone');

const SERVER_TIMEZONE = 'Asia/Ho_Chi_Minh';

function getTimeStartAndEndOfDay(date) {
    const start = moment(date).tz(SERVER_TIMEZONE).startOf('day').toISOString();
    const end = moment(date).tz(SERVER_TIMEZONE).endOf('day').toISOString();
    return { start, end };
}

function formatDateTimeByPattern({ date = '', formatPattern = 'DD/MM/YYYY HH:mm' }) {
    const dateTime = !date ? new Date() : date;
    return moment(dateTime).tz(SERVER_TIMEZONE).format(formatPattern);
}

function getTimeStartAndEndOfDayString(date) {
    const start = moment(date).tz(SERVER_TIMEZONE).startOf('day').toISOString();
    const end = moment(date).tz(SERVER_TIMEZONE).endOf('day').toISOString();
    return { start, end };
}

module.exports = {
    getTimeStartAndEndOfDay,
    formatDateTimeByPattern,
    getTimeStartAndEndOfDayString
};
