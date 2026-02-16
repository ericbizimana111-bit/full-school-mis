const express = require('express');
const Book = require('../models/Book');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

// Get all books
router.get('/books', async (req, res, next) => {
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
    next(error);
  }
});

// Add book
router.post('/books', authorize('librarian', 'admin'), async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    
    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
});

// Issue book
router.post('/books/:id/issue', authorize('librarian', 'admin'), async (req, res, next) => {
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
    next(error);
  }
});

// Return book
router.post('/books/:id/return', authorize('librarian', 'admin'), async (req, res, next) => {
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
    next(error);
  }
});

module.exports = router;