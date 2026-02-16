
const Fee = require('../models/Fee');
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const pdfGenerator = require('../utils/pdfGenerator');

// @desc Create fee record
// @route POST /api/fees
// @access Private/Admin
exports.createFee = async (req, res, next) => {
    try {
        const fee = await Fee.create(req.body);

        const populatedFee = await Fee.findById(fee._id)
            .populate('student')
            .populate({
                path: 'student',
                populate: {
                    path: 'user',
                    select: 'firstName lastName'
                }
            });

        res.status(201).json({
            success: true,
            data: populatedFee
        });
    } catch (error) {
        logger.error(`Create Fee Error: ${error.message}`);
        next(error);
    }
};

// @desc Record payment
// @route POST /api/fees/payment
// @access Private/Accountant
exports.recordPayment = async (req, res, next) => {
    try {
        const { feeId, amount, paymentMethod, transactionId, remarks } = req.body;

        // Create payment
        const payment = await Payment.create({
            fee: feeId,
            student: req.body.student,
            amount,
            paymentMethod,
            transactionId,
            remarks,
            receivedBy: req.user.id
        });

        // Update fee record
        const fee = await Fee.findById(feeId);
        fee.paidAmount += amount;
        await fee.save();

        // Generate receipt PDF
        const receiptPdf = await pdfGenerator.generateReceipt(payment);

        res.status(201).json({
            success: true,
            data: payment,
            receipt: receiptPdf
        });
    } catch (error) {
        logger.error(`Record Payment Error: ${error.message}`);
        next(error);
    }
};

// @desc Get fee details
// @route GET /api/fees/:id
// @access Private
exports.getFee = async (req, res, next) => {
    try {
        const fee = await Fee.findById(req.params.id)
            .populate('student')
            .populate({
                path: 'student',
                populate: {
                    path: 'user',
                    select: 'firstName lastName'
                }
            })
            .populate('payments');

        if (!fee) {
            return res.status(404).json({
                success: false,
                message: 'Fee record not found'
            });
        }

        res.status(200).json({
            success: true,
            data: fee
        });
    } catch (error) {
        logger.error(`Get Fee Error: ${error.message}`);
        next(error);
    }
};

// @desc Get fee report
// @route GET /api/fees/report
// @access Private/Admin
exports.getFeeReport = async (req, res, next) => {
    try {
        const { academicYear, class: classId, status } = req.query;

        let match = {};
        if (academicYear) match.academicYear = academicYear;
        if (status) match.status = status;

        let pipeline = [
            { $match: match },
            {
                $lookup: {
                    from: 'students',
                    localField: 'student',
                    foreignField: '_id',
                    as: 'student'
                }
            },
            { $unwind: '$student' }
        ];

        if (classId) {
            pipeline.push({
                $match: { 'student.class': new mongoose.Types.ObjectId(classId) }
            });
        }

        pipeline.push({
            $group: {
                _id: null,
                totalFees: { $sum: '$totalAmount' },
                totalCollected: { $sum: '$paidAmount' },
                totalPending: {
                    $sum: {
                        $subtract: ['$totalAmount', '$paidAmount']
                    }
                },
                count: { $sum: 1 }
            }
        });

        const report = await Fee.aggregate(pipeline);

        res.status(200).json({
            success: true,
            data: report[0] || {
                totalFees: 0,
                totalCollected: 0,
                totalPending: 0,
                count: 0
            }
        });
    } catch (error) {
        logger.error(`Get Fee Report Error: ${error.message}`);
        next(error);
    }
};

// @desc Get all fees
// @route GET /api/fees
// @access Private
exports.getAllFees = async (req, res, next) => {
    try {
        const { academicYear, class: classId, status } = req.query;

        let query = {};
        if (academicYear) query.academicYear = academicYear;
        if (status) query.status = status;

        const fees = await Fee.find(query)
            .populate('student')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: fees.length,
            data: fees
        });
    } catch (error) {
        logger.error(`Get All Fees Error: ${error.message}`);
        next(error);
    }
};

// @desc Update fee
// @route PUT /api/fees/:id
// @access Private/Admin
exports.updateFee = async (req, res, next) => {
    try {
        let fee = await Fee.findById(req.params.id);

        if (!fee) {
            return res.status(404).json({
                success: false,
                message: 'Fee record not found'
            });
        }

        fee = await Fee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('student');

        res.status(200).json({
            success: true,
            data: fee
        });
    } catch (error) {
        logger.error(`Update Fee Error: ${error.message}`);
        next(error);
    }
};

// @desc Delete fee
// @route DELETE /api/fees/:id
// @access Private/Admin
exports.deleteFee = async (req, res, next) => {
    try {
        const fee = await Fee.findByIdAndDelete(req.params.id);

        if (!fee) {
            return res.status(404).json({
                success: false,
                message: 'Fee record not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Fee record deleted successfully'
        });
    } catch (error) {
        logger.error(`Delete Fee Error: ${error.message}`);
        next(error);
    }
};

