const Transport = require('../models/Transport');
const Student = require('../models/Student');
const logger = require('../utils/logger');

// @desc Get all transport routes
// @route GET /api/transport
// @access Private
exports.getTransportRoutes = async (req, res, next) => {
    try {
        const routes = await Transport.find()
            .populate('driver', 'firstName lastName phone')
            .populate('students', 'admissionNumber');

        res.status(200).json({
            success: true,
            count: routes.length,
            data: routes
        });
    } catch (error) {
        logger.error(`Get Transport Routes Error: ${error.message}`);
        next(error);
    }
};

// @desc Get single transport route
// @route GET /api/transport/:id
// @access Private
exports.getTransportRoute = async (req, res, next) => {
    try {
        const route = await Transport.findById(req.params.id)
            .populate('driver', 'firstName lastName phone email')
            .populate('students');

        if (!route) {
            return res.status(404).json({
                success: false,
                message: 'Transport route not found'
            });
        }

        res.status(200).json({
            success: true,
            data: route
        });
    } catch (error) {
        logger.error(`Get Transport Route Error: ${error.message}`);
        next(error);
    }
};

// @desc Create new transport route
// @route POST /api/transport
// @access Private/Admin
exports.createTransportRoute = async (req, res, next) => {
    try {
        const route = await Transport.create(req.body);

        const populatedRoute = await Transport.findById(route._id)
            .populate('driver', 'firstName lastName phone')
            .populate('students');

        res.status(201).json({
            success: true,
            data: populatedRoute
        });
    } catch (error) {
        logger.error(`Create Transport Route Error: ${error.message}`);
        next(error);
    }
};

// @desc Update transport route
// @route PUT /api/transport/:id
// @access Private/Admin
exports.updateTransportRoute = async (req, res, next) => {
    try {
        let route = await Transport.findById(req.params.id);

        if (!route) {
            return res.status(404).json({
                success: false,
                message: 'Transport route not found'
            });
        }

        route = await Transport.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('driver').populate('students');

        res.status(200).json({
            success: true,
            data: route
        });
    } catch (error) {
        logger.error(`Update Transport Route Error: ${error.message}`);
        next(error);
    }
};

// @desc Delete transport route
// @route DELETE /api/transport/:id
// @access Private/Admin
exports.deleteTransportRoute = async (req, res, next) => {
    try {
        const route = await Transport.findByIdAndDelete(req.params.id);

        if (!route) {
            return res.status(404).json({
                success: false,
                message: 'Transport route not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Transport route deleted successfully'
        });
    } catch (error) {
        logger.error(`Delete Transport Route Error: ${error.message}`);
        next(error);
    }
};

// @desc Assign student to route
// @route PUT /api/transport/:id/assign
// @access Private/Admin
exports.assignStudent = async (req, res, next) => {
    try {
        const { studentId } = req.body;

        const route = await Transport.findById(req.params.id);

        if (!route) {
            return res.status(404).json({
                success: false,
                message: 'Transport route not found'
            });
        }

        if (!route.students.includes(studentId)) {
            route.students.push(studentId);
            await route.save();
        }

        res.status(200).json({
            success: true,
            data: route
        });
    } catch (error) {
        logger.error(`Assign Student Error: ${error.message}`);
        next(error);
    }
};

// @desc Remove student from route
// @route PUT /api/transport/:id/remove
// @access Private/Admin
exports.removeStudent = async (req, res, next) => {
    try {
        const { studentId } = req.body;

        const route = await Transport.findById(req.params.id);

        if (!route) {
            return res.status(404).json({
                success: false,
                message: 'Transport route not found'
            });
        }

        route.students = route.students.filter(id => id.toString() !== studentId);
        await route.save();

        res.status(200).json({
            success: true,
            data: route
        });
    } catch (error) {
        logger.error(`Remove Student Error: ${error.message}`);
        next(error);
    }
};
