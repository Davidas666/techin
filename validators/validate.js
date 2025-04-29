const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorsString = errors
            .array()
            .map((error) => error.msg)
            .join('; ');
        return next(new AppError(errorsString, 400));
    }

    next();
};

module.exports = validate;