const { createBook, getAllBooks, getBookById, getBooksByAuthor, updateBookPart, deleteBook } = require('../models/bookModel');
const AppError = require('../utils/appError');

exports.createBook = async (req, res, next) => {
    try {
        const newBook = req.body;
        const createdBook = await createBook(newBook);

        res.status(201).json({
            status: 'success',
            data: createdBook,
        });
    } catch (error) {
        next(error);
    }
};

exports.getBooks = async (req, res, next) => {
    try {
        const { page, limit, title, authorId } = req.query;

        const booksData = await getAllBooks({
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
            title,
            authorId: parseInt(authorId, 10) || undefined,
        });

        if (booksData.books.length === 0) {
            return next(new AppError('No books found', 404));
        }

        res.status(200).json({
            status: 'success',
            resultsCount: booksData.books.length,
            pagination: booksData.pagination,
            requestedAt: req.requestTime,
            data: booksData.books,
        });
    } catch (error) {
        next(error);
    }
};

exports.getOneBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await getBookById(parseInt(id, 10));

        if (!book) {
            return next(new AppError('Invalid book ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: book,
        });
    } catch (error) {
        next(error);
    }
};

exports.getBooksByAuthor = async (req, res, next) => {
    try {
        const { authorId } = req.params;
        const books = await getBooksByAuthor(parseInt(authorId, 10));

        if (books.length === 0) {
            return next(new AppError('No books found for this author', 404));
        }

        res.status(200).json({
            status: 'success',
            resultsCount: books.length,
            data: books,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedBookData = req.body;

        const updatedBook = await updateBookPart(parseInt(id, 10), updatedBookData);

        if (!updatedBook) {
            return next(new AppError('Invalid book ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: updatedBook,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedBook = await deleteBook(parseInt(id, 10));

        if (!deletedBook) {
            return next(new AppError('Invalid book ID', 404));
        }

        res.status(200).json({
            status: 'success',
            message: 'Book deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

exports.getFilteredBooks = async (req, res, next) => {
    try {
        const filter = req.query;
        const allowedFields = ['title', 'authorId', 'isbn'];

        for (const key of Object.keys(filter)) {
            if (!allowedFields.includes(key) && !['page', 'limit'].includes(key)) {
                return next(
                    new AppError(
                        `Invalid field '${key}'. Allowed fields are: ${allowedFields.join(', ')}`,
                        400
                    )
                );
            }
        }

        const booksData = await getAllBooks({
            page: parseInt(filter.page, 10) || 1,
            limit: parseInt(filter.limit, 10) || 10,
            title: filter.title,
            authorId: parseInt(filter.authorId, 10) || undefined,
        });

        if (booksData.books.length === 0) {
            return next(new AppError('No books found with the specified filters', 404));
        }

        res.status(200).json({
            status: 'success',
            resultsCount: booksData.books.length,
            pagination: booksData.pagination,
            requestedAt: req.requestTime,
            data: booksData.books,
        });
    } catch (error) {
        next(error);
    }
};