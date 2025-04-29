const express = require('express');
const router = express.Router();
const { protect, allowAccessTo } = require('../controllers/authController');
const validateNewAuthor = require('../validators/newAuthor');
const validate = require('../validators/validate');
const {
    createAuthor,
    getAuthors,
    getOneAuthor,
    updateAuthor,
    deleteAuthor,
} = require('../controllers/authorController');


router.get('/', getAuthors);

router.get('/:id', getOneAuthor);

router.post('/', protect, allowAccessTo('admin'), validateNewAuthor, validate, createAuthor);

router.patch('/:id', protect, allowAccessTo('admin'), validateNewAuthor, validate, updateAuthor);

router.delete('/:id', protect, allowAccessTo('admin'), deleteAuthor);

module.exports = router;