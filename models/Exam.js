const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    }, type: {
        type: String, enum: ['Mid-term', 'Final', 'Unit Test', 'Mock', 'Quarterly',
            'Half-yearly', 'Annual'], required: true
    }, class: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true
    }, subjects: [{
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }, date: Date, startTime: String,
        endTime: String, totalMarks: Number, passingMarks: Number, room: String, invigilator: {
            type:
                mongoose.Schema.Types.ObjectId, ref: 'Teacher'
        }
    }],
    academicYear: { type: String, required: true }, startDate: Date,
    endDate: Date, syllabus: [{
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }, topics: [String],
        chapters: [String]
    }], status: {
        type: String, enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'], default: 'Scheduled'
    }, results: { published: { type: Boolean, default: false }, publishDate: Date }
}, { timestamps: true });

examSchema.index({ class: 1, academicYear: 1 });
module.exports = mongoose.model('Exam', examSchema);

