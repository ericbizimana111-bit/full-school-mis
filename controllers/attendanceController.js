const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const mongoose = require('mongoose');
const logger = require('../utils/logger'); // @desc Mark attendance // @route POST /api/attendance // @access Private/Teacher

exports.markAttendance = async (req, res, next) => {


    try {
        const { students, date, class: classId, section, subject, period } = req.body;
        const attendanceRecords = [];
        for (const studentData of students) {
            const attendance = await Attendance.create({
                student: studentData.studentId,
                class: classId,
                section,
                date,
                status: studentData.status,
                subject,
                period,
                remarks: studentData.remarks,
                markedBy: req.user.id,
                academicYear: new Date(date).getFullYear().toString()
            });
            attendanceRecords.push(attendance);
        } // Emit real-time notification via Socket.IO 


        const io = req.app.get('io');
        io.to(`class_${classId}`).emit('attendance_marked', {
            date,
            class: classId,
            section,
            count: attendanceRecords.length
        }); res.status(201).json({ success: true, count: attendanceRecords.length, data: attendanceRecords });
    } catch (error) {
        logger.error(`Mark Attendance Error: ${error.message} `);
        next(error);
    }
}; // @desc Get attendance by class // @routeGET / api / attendance / class/: classId // @access Private 

exports.getAttendanceByClass = async (req, res, next) => {
    try {
        const { date, section } = req.query;
        const query = {
            class: req.params.classId,
            date: new Date(date)
        };


        if (section) query.section = section;

        const attendance = await Attendance.find(query).populate('student').populate({
            path: 'student',
            populate: {
                path: 'user',
                select: 'firstName lastName photo'
            }
        }).populate('subject', 'name')
            .populate('markedBy', 'firstName lastName');

        res.status(200).json({
            success: true,
            count: attendance.length,
            data: attendance
        });

    } catch (error) { next(error); }
}; // @desc Get attendance report // @route GET /api/attendance/report
// @access Private 
// @route GET /api/attendance/report
// @access Private
exports.getAttendanceReport = async (req, res, next) => {
    try {
        const { startDate, endDate, class: classId, section } = req.query;
        const match = {
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };

        if (classId) match.class = new mongoose.Types.ObjectId(classId);
        if (section) match.section = section;

        const report = await Attendance.aggregate([{ $match: match },
        {
            $group: {
                _id: '$student',
                totalDays: { $sum: 1 },
                present: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'Present'] }, 1, 0]
                    }
                },
                absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
                late: { $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] } }
            }
        }, {
            $lookup: {
                from: 'students', localField: '_id',
                foreignField: '_id', as: 'student'
            }
        }, { $unwind: '$student' }, {
            $lookup: {
                from: 'users', localField: 'student.user',
                foreignField: '_id', as: 'user'
            }
        }, { $unwind: '$user' }, {
            $project: {
                studentId: '$_id',
                admissionNumber: '$student.admissionNumber',
                name: {
                    $concat: ['$user.firstName', ' ', '$user.lastName']
                },
                totalDays: 1,
                present: 1,
                absent: 1,
                late: 1,
                percentage: { $multiply: [{ $divide: ['$present', '$totalDays'] }, 100] }
            }
        }, {
            $sort: {
                percentage: -1
            }
        }]);
        res.status(200).json({ success: true, count: report.length, data: report });
    } catch (error) {
        next(error);
    }
}; 