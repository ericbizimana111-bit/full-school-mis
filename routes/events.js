const express = require('express');
const Event = require('../models/Event');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

// Get all events
router.get('/', async (req, res, next) => {
    try {
        const { type, status, startDate, endDate } = req.query;
        let query = {};

        if (type) query.type = type;
        if (status) query.status = status;

        if (startDate || endDate) {
            query.startDate = {};
            if (startDate) query.startDate.$gte = new Date(startDate);
            if (endDate) query.startDate.$lte = new Date(endDate);
        }

        const events = await Event.find(query)
            .populate('organizer', 'firstName lastName')
            .populate('participants.classes', 'name grade')
            .sort({ startDate: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        next(error);
    }
});

// Create event
router.post('/', authorize('admin', 'teacher'), async (req, res, next) => {
    try {
        const event = await Event.create({
            ...req.body,
            organizer: req.user.id
        });

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
});

// Update event
router.put('/:id', authorize('admin', 'teacher'), async (req, res, next) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;