
const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({

    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, exam: {
        type:
            mongoose.Schema.Types.ObjectId,
        ref: 'Exam', required: true
    }, subject: {
        type: mongoose.Schema.Types.ObjectId, ref:
            'Subject', required: true
    }, marks: {
        obtained: { type: Number, required: true }, total: {
            type: Number, required: true
        }
    }, grade: { type: String, enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'] }, remarks: String, gradedBy: {
        type:
            mongoose.Schema.Types.ObjectId, ref: 'Teacher'
    }, academicYear: String
}, { timestamps: true }); // Calculate gradebased on percentage


gradeSchema.pre('save', function (next) {

    const percentage = (this.marks.obtained / this.marks.total) * 100;
    if (percentage >= 90) this.grade = 'A+';
    else if (percentage >= 80) this.grade = 'A';
    else if (percentage >= 70)  this.grade = 'B+';
    else if (percentage >= 60) this.grade = 'B';
    else if (percentage >= 50) this.grade = 'C+';
    else if(percentage >= 40) this.grade = 'C';
    else if (percentage >= 33) this.grade = 'D';
    else this.grade = 'F'; next();
});

gradeSchema.index({ student: 1, exam: 1, subject: 1 });
module.exports = mongoose.model('Grade', gradeSchema);


