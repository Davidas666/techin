const express = require('express');
const router = express.Router();
const { protect, allowAccessTo } = require('../controllers/authController'); // Pataisyta
const validateNewBook = require('../validators/newBook');
const validate = require('../validators/validate');
const {
    createBook,
    getBooks,
    getOneBook,
    getBooksByAuthor,
    updateBook,
    deleteBook,
    getFilteredBooks,
} = require('../controllers/bookController');

router.get('/', getBooks);
router.get('/filter', getFilteredBooks);


router.get('/author/:authorId', getBooksByAuthor);


router.get('/:id', getOneBook);


router.post('/', protect, allowAccessTo('admin'), validateNewBook, validate, createBook);


router.patch('/:id', protect, allowAccessTo('admin'), validateNewBook, validate, updateBook);


router.delete('/:id', protect, allowAccessTo('admin'), deleteBook);

module.exports = router;