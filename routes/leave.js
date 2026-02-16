const express = require('express');
const Leave = require('../models/Leave');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

// Get all leave requests
router.get('/', async (req, res, next) => {
    try {
        const { status, userType } = req.query;
        let query = {};

        // If not admin, only show own leaves
        if (req.user.role !== 'admin') {
            query.user = req.user.id;
        }

        if (status) query.status = status;
        if (userType) query.userType = userType;

        const leaves = await Leave.find(query)
            .populate('user', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves
        });
    } catch (error) {
        next(error);
    }
});

// Apply for leave
router.post('/', async (req, res, next) => {
    try {
        const leave = await Leave.create({
            ...req.body,
            user: req.user.id,
            userType: req.user.role === 'teacher' ? 'Teacher' : 'Student'
        });

        res.status(201).json({
            success: true,
            data: leave
        });
    } catch (error) {
        next(error);
    }
});

// Approve/Reject leave
router.put('/:id/status', authorize('admin'), async (req, res, next) => {
    try {
        const { status, remarks } = req.body;

        const leave = await Leave.findByIdAndUpdate(
            req.params.id,
            {
                status,
                remarks,
                approvedBy: req.user.id,
                approvalDate: Date.now()
            },
            { new: true }
        );

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: leave
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;