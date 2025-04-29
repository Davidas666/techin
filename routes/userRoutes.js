const express = require('express');
const { signup, login, protect, logout } = require('../controllers/authController');
const validate = require('../validators/validate');
const validateNewUser = require('../validators/signup');
const validateLogin = require('../validators/login');

const router = express.Router();

router.route('/register').post(validateNewUser, validate, signup);
router.route('/login').post(validateLogin, validate, login); 
router.route('/logout').get(protect, logout);

module.exports = router;