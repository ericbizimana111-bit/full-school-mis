const Book = require('../models/Book');
const Library = require('../models/Library');
const logger = require('../utils/logger');

// @desc Get all books
// @route GET /api/library/books
// @access Private
exports.getBooks = async (req, res, next) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { isbn: { $regex: search, $options: 'i' } }
            ];
        }

        const books = await Book.find(query).sort({ title: 1 });

        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        logger.error(`Get Books Error: ${error.message}`);
        next(error);
    }
};

// @desc Add book
// @route POST /api/library/books
// @access Private/Admin
exports.addBook = async (req, res, next) => {
    try {
        const book = await Book.create(req.body);

        res.status(201).json({
            success: true,
            data: book
        });
    } catch (error) {
        logger.error(`Add Book Error: ${error.message}`);
        next(error);
    }
};

// @desc Issue book
// @route POST /api/library/books/:id/issue
// @access Private/Admin
exports.issueBook = async (req, res, next) => {
    try {
        const { studentId, dueDate } = req.body;
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        if (book.copies.available <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Book not available'
            });
        }

        book.currentBorrowers.push({
            student: studentId,
            borrowDate: new Date(),
            dueDate: dueDate
        });

        book.copies.available -= 1;
        await book.save();

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        logger.error(`Issue Book Error: ${error.message}`);
        next(error);
    }
};

// @desc Return book
// @route POST /api/library/books/:id/return
// @access Private/Admin
exports.returnBook = async (req, res, next) => {
    try {
        const { studentId } = req.body;
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        const borrowerIndex = book.currentBorrowers.findIndex(
            b => b.student.toString() === studentId
        );

        if (borrowerIndex === -1) {
            return res.status(400).json({
                success: false,
                message: 'This book was not borrowed by this student'
            });
        }

        const borrower = book.currentBorrowers[borrowerIndex];

        // Add to history
        book.borrowHistory.push({
            student: borrower.student,
            borrowDate: borrower.borrowDate,
            returnDate: borrower.dueDate,
            actualReturnDate: new Date(),
            status: 'Returned'
        });

        // Remove from current borrowers
        book.currentBorrowers.splice(borrowerIndex, 1);
        book.copies.available += 1;

        await book.save();

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        logger.error(`Return Book Error: ${error.message}`);
        next(error);
    }
};

// @desc Get book details
// @route GET /api/library/books/:id
// @access Private
exports.getBookDetail = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        logger.error(`Get Book Detail Error: ${error.message}`);
        next(error);
    }
};

// @desc Update book
// @route PUT /api/library/books/:id
// @access Private/Admin
exports.updateBook = async (req, res, next) => {
    try {
        let book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        logger.error(`Update Book Error: ${error.message}`);
        next(error);
    }
};

// @desc Delete book
// @route DELETE /api/library/books/:id
// @access Private/Admin
exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        logger.error(`Delete Book Error: ${error.message}`);
        next(error);
    }
};
