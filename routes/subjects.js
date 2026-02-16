const express = require('express');
const Subject = require('../models/Subject');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

// Get all subjects
router.get('/', async (req, res, next) => {
  try {
    const subjects = await Subject.find()
      .populate('classes', 'name grade')
      .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    next(error);
  }
});

// Create subject
router.post('/', authorize('admin'), async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    
    res.status(201).json({
      success: true,
      data: subject
    });
  } catch (error) {
    next(error);
  }
});

// Update subject
router.put('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
