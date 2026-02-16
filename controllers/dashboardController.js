const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const Exam = require('../models/Exam');
const Event = require('../models/Event');
const logger = require('../utils/logger');

// @desc Get admin dashboard data
// @route GET /api/dashboard/admin
// @access Private/Admin 

exports.getAdminDashboard = async (req, res, next) => {
    try {
        const today = new Date(); today.setHours(0, 0, 0, 0); // Get counts 
        // 

        const totalStudents = await Student.countDocuments({
            status: 'active'
        });
        const totalTeachers = await Teacher.countDocuments({ isActive: true }); // Today's attendance 
        const todayAttendance = await Attendance.aggregate([{ $match: { date: today } }, {
            $group: {
                _id: '$status', count: {
                    $sum: 1
                }
            }
        }]); const attendanceStats = { present: 0, absent: 0, late: 0, total: 0 }; todayAttendance.forEach(item => {
            attendanceStats[item._id.toLowerCase()] = item.count; attendanceStats.total += item.count;
        }); // Fee statistics
        // 
        const feeStats = await Fee.aggregate([{
            $group: {
                _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$totalAmount' },
                paidAmount: { $sum: '$paidAmount' }
            }
        }]); // Upcoming events
        const upcomingEvents = await Event.find({
            startDate: {
                $gte: new Date()
            }, status: 'Scheduled'
        }).sort({ startDate: 1 }).limit(5); // Upcoming exams 
        // 

        const upcomingExams = await Exam.find({ startDate: { $gte: new Date() }, status: 'Scheduled' }).populate('class', 'name grade').sort({
            startDate: 1
        }).limit(5); res.status(200).json({
            success: true, data: {
                students: { total: totalStudents }, teachers: {
                    total: totalTeachers
                }, attendance: attendanceStats, fees: feeStats, upcomingEvents, upcomingExams
            }
        });
    } catch (error) { logger.error(`Dashboard Error: ${error.message} `); next(error); }
}; // @desc Get teacher dashboard data // @route GET / api / dashboard / teacher // @access Private/Teacher 



exports.getTeacherDashboard = async (req, res, next) => {
    try {
        const Teacher = require('../models/Teacher'); const teacher = await Teacher.findOne({ user: req.user.id })
            .populate('classes.class').populate('subjects'); if (!teacher) {
                return res.status(404).json({
                    success: false, message:
                        'Teacher record not found'
                });
            } // Get classes count 



        const classesCount = teacher.classes.length; // Get today's schedule
        const today = new Date().toLocaleString('en-us', { weekday: 'long' }); // Upcoming events for teacher
        const upcomingEvents = await Event.find({ 'participants.teachers': teacher._id, startDate: { $gte: new Date() } }).sort({
            startDate: 1
        }).limit(5); res.status(200).json({
            success: true, data: {
                teacher, classesCount, todaySchedule: today,
                upcomingEvents
            }
        });
    } catch (error) { next(error); }
}; // @desc Get student dashboard data // @route GET /api/dashboard / student // @access Private/Student 



exports.getStudentDashboard = async (req, res, next) => {
    try {
        const
            student = await Student.findOne({ user: req.user.id }).populate('class').populate('parents'); if (!student) {
                return res.status(404).json({ success: false, message: 'Student record not found' });
            } // Get attendance percentage 
        const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); const attendance = await
            Attendance.find({ student: student._id, date: { $gte: thirtyDaysAgo } }); const present = attendance.filter(a =>
                a.status === 'Present').length; const attendancePercentage = attendance.length > 0 ? ((present / attendance.length) *
                    100).toFixed(2) : 0; // Get recent grades 

        const Grade = require('../models/Grade');

        const recentGrades = await Grade.find({ student: student._id }).populate('exam', 'name').populate('subject', 'name').sort({ createdAt: -1 })
            .limit(5); // Get pending fees 
        const pendingFees = await Fee.find({
            student: student._id, status: {
                $in: ['Pending',
                    'Partial', 'Overdue']
            }
        }); // Upcoming events 
        const upcomingEvents = await Event.find({
            $or: [{
                'participants.students': student._id
            }, { 'participants.classes': student.class._id }], startDate: { $gte: new Date() }
        }).sort({ startDate: 1 }).limit(5); res.status(200).json({
            success: true, data: {
                student, attendancePercentage,
                recentGrades, pendingFees, upcomingEvents
            }
        });
    } catch (error) { next(error); }
}; 
