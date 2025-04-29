const { body } = require('express-validator');
const { getUserByUsername } = require('../models/userModel');

const validateNewUser = [
    body().notEmpty().withMessage('User body must contain data'),
    body('username')
        .notEmpty()
        .withMessage('Username is required')
        .custom(async (value) => {
            const user = await getUserByUsername(value);
            if (user) {
                throw new Error('Username already exists');
            }
            return true;
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .custom(async (value, { req }) => {
            if (value !== req.body.passwordconfirm) {
                throw new Error('Password and password confirmation do not match.');
            }
            return true;
        }),
    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either "user" or "admin"'),
];

module.exports = validateNewUser;