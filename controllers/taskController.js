const Task = require('../models/Project');
const logger = require('../utils/logger');

// @desc Get all tasks
// @route GET /api/tasks
// @access Private
exports.getTasks = async (req, res, next) => {
    try {
        const { status, priority, assignedTo } = req.query;
        let query = {};

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (assignedTo) query.assignedTo = assignedTo;

        const tasks = await Task.find(query)
            .populate('assignedTo', 'firstName lastName')
            .populate('project')
            .sort({ dueDate: 1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        logger.error(`Get Tasks Error: ${error.message}`);
        next(error);
    }
};

// @desc Get single task
// @route GET /api/tasks/:id
// @access Private
exports.getTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'firstName lastName')
            .populate('project')
            .populate('comments.user', 'firstName lastName photo');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        logger.error(`Get Task Error: ${error.message}`);
        next(error);
    }
};

// @desc Create task
// @route POST /api/tasks
// @access Private
exports.createTask = async (req, res, next) => {
    try {
        const task = await Task.create({
            ...req.body,
            createdBy: req.user.id
        });

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'firstName lastName')
            .populate('project');

        res.status(201).json({
            success: true,
            data: populatedTask
        });
    } catch (error) {
        logger.error(`Create Task Error: ${error.message}`);
        next(error);
    }
};

// @desc Update task
// @route PUT /api/tasks/:id
// @access Private
exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('assignedTo', 'firstName lastName').populate('project');

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        logger.error(`Update Task Error: ${error.message}`);
        next(error);
    }
};

// @desc Delete task
// @route DELETE /api/tasks/:id
// @access Private
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        logger.error(`Delete Task Error: ${error.message}`);
        next(error);
    }
};

// @desc Add comment to task
// @route POST /api/tasks/:id/comments
// @access Private
exports.addComment = async (req, res, next) => {
    try {
        const { text } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        task.comments.push({
            user: req.user.id,
            text,
            date: new Date()
        });

        await task.save();

        const populatedTask = await Task.findById(task._id)
            .populate('comments.user', 'firstName lastName photo');

        res.status(200).json({
            success: true,
            data: populatedTask
        });
    } catch (error) {
        logger.error(`Add Comment Error: ${error.message}`);
        next(error);
    }
};

// @desc Get my tasks
// @route GET /api/tasks/my-tasks
// @access Private
exports.getMyTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user.id })
            .populate('project')
            .sort({ dueDate: 1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        logger.error(`Get My Tasks Error: ${error.message}`);
        next(error);
    }
};

// @desc Get task statistics
// @route GET /api/tasks/stats
// @access Private
exports.getTaskStats = async (req, res, next) => {
    try {
        const total = await Task.countDocuments();
        const completed = await Task.countDocuments({ status: 'Completed' });
        const inProgress = await Task.countDocuments({ status: 'In Progress' });
        const pending = await Task.countDocuments({ status: 'Pending' });

        res.status(200).json({
            success: true,
            data: {
                total,
                completed,
                inProgress,
                pending,
                completionRate: ((completed / total) * 100).toFixed(2)
            }
        });
    } catch (error) {
        logger.error(`Get Task Stats Error: ${error.message}`);
        next(error);
    }
};
