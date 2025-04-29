const { body } = require('express-validator');
const { sql } = require('../dbConnection');

const validateNewBook = [
    body().notEmpty().withMessage('Request body must have data'),

    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be a string')
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters'),

    body('summary')
        .optional()
        .isString()
        .withMessage('Summary must be a string'),

    body('isbn')
        .notEmpty()
        .withMessage('ISBN is required')
        .matches(/^[0-9-]{10,17}$/)
        .withMessage('ISBN must be 10 or 13-17 characters, containing only digits and hyphens'),

    body('author_id')
        .notEmpty()
        .withMessage('Author ID is required')
        .isInt({ min: 1 })
        .withMessage('Author ID must be a positive integer')
        .custom(async (value) => {
            const author = await sql`SELECT id FROM authors WHERE id = ${value}`;
            if (author.length === 0) {
                throw new Error('Invalid author ID, not found in authors table');
            }
            return true;
        }),
];

module.exports = validateNewBook;