const { body } = require('express-validator');
const argon2 = require('argon2');
const { getUserByUsername } = require('../models/userModel');

const validateLogin = [
    body('username')
        .notEmpty()
        .withMessage('Username is required')
        .custom(async (value) => {
            const user = await getUserByUsername(value);
            if (!user) {
                throw new Error('User not found, please sign up');
            }
            return true;
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .custom(async (value, { req }) => {
            const user = await getUserByUsername(req.body.username);
            if (user) {
                const matchPass = await argon2.verify(user.password, value);
                if (!matchPass) {
                    throw new Error('Incorrect password');
                }
                return true;
            }
        }),
];

module.exports = validateLogin;