const STATUS = {
    INACTIVE: 0,
    ACTIVE: 1
};

const ERROR_CODES = {
    ERROR_POST_NOT_FOUND: 'error_post_not_found',
    ERROR_POST_INVALID: 'error_post_invalid',
    ERROR_YOU_ALREADY_LIKE_POST: 'error_you_already_like_post',
    ERROR_YOU_NOT_LIKE_POST_YET: 'error_you_not_like_post_yet'
};

module.exports = {
    STATUS,
    ERROR_CODES
};
