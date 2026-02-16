const Teacher = require('../models/Teacher');
const User = require('../models/User');
const logger = require('../utils/logger'); // @desc Get all teachers // @route GET / api / teachers // @access Private 

exports.getTeachers = async (req, res, next) => {
    try {
        const { department,
            designation, search } = req.query; let query = {};
        if (department) query.department = department;
        if (designation) query.designation = designation;
        if (search) {
            const users = await User.find({
                $or: [{
                    firstName: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }]
            }).select('_id');
            query.user = { $in: users.map(u => u._id) };
        } const teachers = await Teacher.find(query).populate('user', 'firstName lastName email phone photo').populate('subjects', 'name code').populate('classes.class',
            'name grade').sort({ createdAt: -1 }); res.status(200).json({ success: true, count: teachers.length, data: teachers });
    } catch (error) { logger.error(`Get Teachers Error: ${error.message} `); next(error); }
}; // @desc Get single teacher
// @route GET /api/teachers/:id // @access Private 
exports.getTeacher = async (req, res, next) => {
    try {
        const teacher
            = await Teacher.findById(req.params.id).populate('user').populate('subjects').populate('classes.class'); if
            (!teacher) { return res.status(404).json({ success: false, message: 'Teacher not found' }); } res.status(200).json({
                success: true, data: teacher
            });
    } catch (error) { next(error); }
}; // @desc Create new teacher // @route POST
/api/teachers // @access Private/Admin 
exports.createTeacher = async (req, res, next) => {
    try {
        const { userData,
            teacherData } = req.body; // Create user first 
        const user = await User.create({ ...userData, role: 'teacher' }); //Create teacher
        const teacher = await Teacher.create({ ...teacherData, user: user._id }); // Populate and return const
        populatedTeacher = await Teacher.findById(teacher._id).populate('user').populate('subjects'); res.status(201).json({
            success: true, data: populatedTeacher
        });
    } catch (error) {
        logger.error(`Create Teacher Error: ${error.message} `);
        next(error);
    }
}; // @desc Update teacher // @route PUT /api/teachers/:id // @access Private/Admin 
exports.updateTeacher = async (req, res, next) => {
    try {
        let teacher = await Teacher.findById(req.params.id); if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher not found' });
        } const { userData, teacherData } = req.body; //Update user if userData provided 
        if (userData) {
            await User.findByIdAndUpdate(teacher.user, userData, {
                new: true,
                runValidators: true
            });
        } // Update teacher 
        teacher = await Teacher.findByIdAndUpdate(req.params.id, teacherData, {
            new: true, runValidators: true
        }).populate('user').populate('subjects'); res.status(200).json({
            success: true, data: teacher
        });
    } catch (error) { next(error); }
}; // @desc Delete teacher // @route DELETE /api/teachers/:id // @accessPrivate / Admin
exports.deleteTeacher = async (req, res, next) => {
    try {
        const teacher = await
            Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({
                success: false, message: 'Teacher not found'
            });
        } // Soft delete 
        await Teacher.findByIdAndUpdate(req.params.id, { isActive: false });
        await User.findByIdAndUpdate(teacher.user,
            { isActive: false });
        res.status(200).json({ success: true, data: {} });
    } catch
    (error) { next(error); }
}; 