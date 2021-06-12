const _ = require("lodash");
const CreateError = require("http-errors");
const escapeStringRegexp = require("escape-string-regexp");
const { getTimeStartAndEndOfDay } = require("./datetime.helper");

/**
 * goal function: built text search by arr fields name
 * @fields {array} array fields name
 * @q {string} string query
 * @return {array}
 */
function buildTextSearch(fields = [], q = "") {
    const $or = [];

    if (!fields.length || q === "") {
        return $or;
    }

    fields.forEach((field) => {
        $or.push(
            {
                [field]: new RegExp(escapeStringRegexp(q), "i")
            }
        );
    });

    return $or;
}

function mergerQueryArray({ query, field, item }) {
    if (!query[field]) {
        query[field] = [item];
    } else {
        query[field].push(item);
    }
    return _.cloneDeep(query);
}

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function convertSelectQuery(select = "") {
    return select.split(",").join(" ");
}

function buildConditionDate({ start = "", end = "", field = "" }) {
    const conditionDate = [];
    if (!start || !end || !field) return [];

    if (start) {
        const { start: startDate } = getTimeStartAndEndOfDay(start);
        conditionDate.push({ [field]: { $gte: new Date(startDate) } });
    }

    if (end) {
        const { end: endDate } = getTimeStartAndEndOfDay(end);
        conditionDate.push({ [field]: { $lte: new Date(endDate) } });
    }

    return conditionDate;
}

function mergeConditionDate(conditions = {}, conditionDate = []) {
    const newConditions = _.cloneDeep(conditions);

    if (conditionDate.length) {
        if (!newConditions.$and) {
            newConditions.$and = conditionDate;
        } else {
            newConditions.$and = [...newConditions.$and, ...conditionDate];
        }
    }
    return newConditions;
}

function splitStringIdsToArray(ids = "") {
    return ids.split(",").map((id) => id.trim());
}

function validateArrayQueryLength(list = [], messageError = "", validLength = 100) {
    if (list.length > validLength) {
        throw new CreateError.BadRequest(messageError || "error_params_query_invalid");
    }
    return true;
}
/**
 * goal function: accept string sort and build to object sort in mongodb
 * @sortString {string} string sort: "-created_at,name,-age"
 * @return {object} object sort: {created_at: -1, name: 1, age: -1}
 */
function buildSortStringToObject(sortString = "") {
    const sort = {};
    if (!sortString) return sort;
    sortString.split(",").forEach((field) => {
        const typeSort = field.charAt(0);
        if (typeSort !== "-") {
            sort[field] = 1;
        } else {
            const fieldSort = field.substring(1);
            sort[fieldSort] = -1;
        }
    });
    return sort;
}

module.exports = {
    buildTextSearch,
    mergerQueryArray,
    convertSelectQuery,
    timeout,
    buildConditionDate,
    mergeConditionDate,
    splitStringIdsToArray,
    validateArrayQueryLength,
    buildSortStringToObject
};
