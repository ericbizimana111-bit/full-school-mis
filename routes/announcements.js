const express = require('express');
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

// Get all announcements
router.get('/', async (req, res, next) => {
  try {
    const { type, isActive } = req.query;
    let query = {};
    
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const announcements = await Announcement.find(query)
      .populate('publishedBy', 'firstName lastName')
      .sort({ publishDate: -1 });
    
    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    next(error);
  }
});

// Create announcement
router.post('/', authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      publishedBy: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    next(error);
  }
});

// Update announcement
router.put('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    next(error);
  }
});

// Delete announcement
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;