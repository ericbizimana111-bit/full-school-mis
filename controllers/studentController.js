const Student = require('../models/Student');
const User = require('../models/User');
const logger = require('../utils/logger'); // @desc Get all students // @route GET/api/students // @access Private
exports.getStudents = async (req, res, next) => {
    try {
        const { class: classId,
            section,
            academicYear,
            status,
            search
        } = req.query;

        let query = {};

        if (classId) query.class = classId;
        if (section) query.section = section;
        if (academicYear) query.academicYear = academicYear;
        if (status) query.status = status;
        if (search) {
            const users = await User.find({
                $or: [{ firstName: { $regex: search, $options: 'i' } }, {
                    lastName: {
                        $regex: search, $options: 'i'
                    }
                },
                { email: { $regex: search, $options: 'i' } }]
            }).select('_id'); query.user = {
                $in: users.map(u => u._id)
            };
        } const students = await Student.find(query).populate('user', 'firstName lastName email phone photo').populate('class', 'name grade').populate('parents').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: students.length, data: students });
    } catch (error) {
        logger.error(`Get Students Error: ${error.message}
`); next(error);
    }
}; // @desc Get single student // @route GET /api/students/:id // @access Private 
exports.getStudent = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id).populate('user')
            .populate('class').populate('parents').populate('hostel').populate('transport'); if (!student) {
                return res.status(404).json({ success: false, message: 'Student not found' });
            } res.status(200).json({
                success: true, data:
                    student
            });
    } catch (error) { next(error); }
}; // @desc Create new student // @route POST /api/students // @accessPrivate / Admin 
exports.createStudent = async (req, res, next) => {
    try {
        const { userData, studentData } = req.body; //Create user first 
        const user = await User.create({ ...userData, role: 'student' }); // Create student 
        const student = await Student.create({ ...studentData, user: user._id }); // Populate and return 
        const populatedStudent = await Student.findById(student._id).populate('user').populate('class'); res.status(201).json({
            success: true, data:
                populatedStudent
        });
    } catch (error) {
        logger.error(`Create Student Error: ${error.message} `);
        next(error);
    }
}; //@desc Update student // @route PUT /api/students/:id // @access Private/Admin 
exports.updateStudent = async (req, res, next) => {
    try {
        let student = await Student.findById(req.params.id); if (!student) {
            return res.status(404).json({
                success: false, message: 'Student not found'
            });
        } const { userData, studentData } = req.body; // Update user if userData provided
        if (userData) {
            await User.findByIdAndUpdate(student.user, userData, {
                new: true, runValidators: true
            });
        } // Update  student 
        student = await Student.findByIdAndUpdate(req.params.id, studentData, {
            new: true,
            runValidators: true
        }).populate('user').populate('class'); res.status(200).json({ success: true, data: student });
    }
    catch (error) { next(error); }
}; // @desc Delete student // @route DELETE /api/students/:id // @access Private/Admin
exports.deleteStudent = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id); if
            (!student) { return res.status(404).json({ success: false, message: 'Student not found' }); } // Soft delete - mark as inactive
        await Student.findByIdAndUpdate(req.params.id, { status: 'inactive' });
        await User.findByIdAndUpdate(student.user, { isActive: false }); res.status(200).json({ success: true, data: {} });
    } catch
    (error) { next(error); }
}; // @desc Get student attendance // @route GET /api/students/:id/attendance // @access Private 
exports.getStudentAttendance = async (req, res, next) => {

    try {
        const { startDate, endDate } = req.query; const
            Attendance = require('../models/Attendance'); let query = { student: req.params.id };

        if (startDate || endDate) {

            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const attendance = await Attendance.find(query).populate('subject', 'name').populate('markedBy', 'firstName lastName').sort({ date: -1 }); // Calculate statistics 
        const total = attendance.length;
        const present = attendance.filter(a => a.status === 'Present').length;
        const absent = attendance.filter(a => a.status === 'Absent').length;
        const late = attendance.filter(a => a.status === 'Late').length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;
        res.status(200).json({
            success: true, data: attendance, statistics: {
                total,
                present,
                absent,
                late,
                percentage
            }
        });
    } catch (error) { next(error); }
}; // @desc Get student grades // @route GET/api/students /: id / grades // @access Private
exports.getStudentGrades = async (req, res, next) => {
    try {

        const { academicYear, exam } = req.query;
        const Grade = require('../models/Grade'); let query = { student: req.params.id };
        if (academicYear) query.academicYear = academicYear;
        if (exam) query.exam = exam;
        const grades = await Grade.find(query).populate('exam', 'name type').populate('subject', 'name code').populate('gradedBy', 'firstName lastName').sort({
            createdAt: -1
        });
        res.status(200).json({ success: true, count: grades.length, data: grades });

    } catch (error) {
        next(error);
    }
}; 