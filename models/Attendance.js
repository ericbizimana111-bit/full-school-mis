
const mongoose = require('mongoose'); const attendanceSchema = new mongoose.Schema({
    student:
        { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class', required: true
        }, section: { type: String, required: true }, date: { type: Date, required: true }, status:
        { type: String, enum: ['Present', 'Absent', 'Late', 'Half-day', 'Excused'], required: true }, subject: {
            type:
                mongoose.Schema.Types.ObjectId, ref: 'Subject'
        }, remarks: String, markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher', required: true
        }, period: Number, academicYear: String
},
{ timestamps: true }); // Compound index forunique attendance per student per day attendanceSchema.index({ student: 1, date: 1, period: 1 }, { unique: true });

attendanceSchema.index({ class: 1, section: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);

