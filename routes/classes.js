const express = require('express');
const Class = require('../models/Class');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

// Get all classes
router.get('/', async (req, res, next) => {
  try {
    const { academicYear } = req.query;
    let query = {};
    
    if (academicYear) query.academicYear = academicYear;
    
    const classes = await Class.find(query)
      .populate('subjects', 'name code')
      .populate('sections.classTeacher', 'firstName lastName')
      .sort({ grade: 1 });
    
    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    next(error);
  }
});

// Create class
router.post('/', authorize('admin'), async (req, res, next) => {
  try {
    const classData = await Class.create(req.body);
    
    res.status(201).json({
      success: true,
      data: classData
    });
  } catch (error) {
    next(error);
  }
});

// Update class
router.put('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const classData = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('subjects').populate('sections.classTeacher');
    
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    next(error);
  }
});

// Delete class
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;