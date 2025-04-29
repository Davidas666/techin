// controllers/authorController.js
const {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor,
} = require('../models/bookModel');
const AppError = require('../utils/appError');

exports.createAuthor = async (req, res, next) => {
    try {
        const newAuthor = req.body;
        const createdAuthor = await createAuthor(newAuthor);

        res.status(201).json({
            status: 'success',
            data: createdAuthor,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAuthors = async (req, res, next) => {
    try {
        const { page, limit } = req.query;

        const authorsData = await getAllAuthors({
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
        });

        if (authorsData.authors.length === 0) {
            return next(new AppError('No authors found', 404));
        }

        res.status(200).json({
            status: 'success',
            resultsCount: authorsData.authors.length,
            pagination: authorsData.pagination,
            requestedAt: req.requestTime,
            data: authorsData.authors,
        });
    } catch (error) {
        next(error);
    }
};

exports.getOneAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const author = await getAuthorById(parseInt(id, 10));

        if (!author) {
            return next(new AppError('Invalid author ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: author,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedAuthorData = req.body;

        const updatedAuthor = await updateAuthor(parseInt(id, 10), updatedAuthorData);

        if (!updatedAuthor) {
            return next(new AppError('Invalid author ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: updatedAuthor,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedAuthor = await deleteAuthor(parseInt(id, 10));

        if (!deletedAuthor) {
            return next(new AppError('Invalid author ID', 404));
        }

        res.status(200).json({
            status: 'success',
            message: 'Author deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};