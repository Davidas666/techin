const { body } = require('express-validator');

const validateNewAuthor = [
    body().notEmpty().withMessage('Request body must have data'),

    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),

    body('birth_date')
        .notEmpty()
        .withMessage('Birth date is required')
        .isISO8601()
        .withMessage('Birth date must be a valid ISO 8601 date (e.g., YYYY-MM-DD)'),

    body('biography')
        .optional()
        .isString()
        .withMessage('Biography must be a string')
        .isLength({ max: 150 })
        .withMessage('Biography must not exceed 150 characters'),
];

module.exports = validateNewAuthor;