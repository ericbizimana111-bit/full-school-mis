const Exam = require('../models/Exam');
const logger = require('../utils/logger');

// @desc Create exam
// @route POST /api/exams
// @access Private/Admin
exports.createExam = async (req, res, next) => {
    try {
        const exam = await Exam.create(req.body);

        const populatedExam = await Exam.findById(exam._id)
            .populate('class', 'name grade')
            .populate('subjects.subject', 'name code')
            .populate('subjects.invigilator', 'firstName lastName');

        res.status(201).json({
            success: true,
            data: populatedExam
        });
    } catch (error) {
        logger.error(`Create Exam Error: ${error.message}`);
        next(error);
    }
};

// @desc Get all exams
// @route GET /api/exams
// @access Private
exports.getExams = async (req, res, next) => {
    try {
        const { academicYear, class: classId, type, status } = req.query;
        let query = {};

        if (academicYear) query.academicYear = academicYear;
        if (classId) query.class = classId;
        if (type) query.type = type;
        if (status) query.status = status;

        const exams = await Exam.find(query)
            .populate('class', 'name grade')
            .populate('subjects.subject', 'name')
            .sort({ startDate: -1 });

        res.status(200).json({
            success: true,
            count: exams.length,
            data: exams
        });
    } catch (error) {
        logger.error(`Get Exams Error: ${error.message}`);
        next(error);
    }
};

// @desc Update exam
// @route PUT /api/exams/:id
// @access Private/Admin
exports.updateExam = async (req, res, next) => {
    try {
        let exam = await Exam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            .populate('class')
            .populate('subjects.subject');

        res.status(200).json({ success: true, data: exam });
    } catch (error) {
        logger.error(`Update Exam Error: ${error.message}`);
        next(error);
    }
};

// @desc Publish exam results
// @route PUT /api/exams/:id/publish
// @access Private/Admin
exports.publishResults = async (req, res, next) => {
    try {
        const exam = await Exam.findByIdAndUpdate(
            req.params.id,
            {
                'results.published': true,
                'results.publishDate': Date.now()
            },
            { new: true }
        );

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        // Emit real-time notification
        const io = req.app.get('io');
        if (io) {
            io.emit('results_published', {
                examId: exam._id,
                examName: exam.name
            });
        }

        res.status(200).json({
            success: true,
            data: exam
        });
    } catch (error) {
        logger.error(`Publish Results Error: ${error.message}`);
        next(error);
    }
};

// @desc Get exam details
// @route GET /api/exams/:id
// @access Private
exports.getExam = async (req, res, next) => {
    try {
        const exam = await Exam.findById(req.params.id)
            .populate('class')
            .populate('subjects.subject')
            .populate('subjects.invigilator');

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        res.status(200).json({
            success: true,
            data: exam
        });
    } catch (error) {
        logger.error(`Get Exam Error: ${error.message}`);
        next(error);
    }
};

// @desc Delete exam
// @route DELETE /api/exams/:id
// @access Private/Admin
exports.deleteExam = async (req, res, next) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Exam deleted successfully'
        });
    } catch (error) {
        logger.error(`Delete Exam Error: ${error.message}`);
        next(error);
    }
};

