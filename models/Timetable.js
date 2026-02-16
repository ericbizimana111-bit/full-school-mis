const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId, ref:
            'Class', required: true
    }, section: { type: String, required: true }, academicYear: { type: String, required: true },
    schedule: [{
        day: {
            type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required:
                true
        }, periods: [{
            periodNumber: Number, subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }, teacher: {
                type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'
            }, startTime: String, endTime: String, room: String
        }]
    }],
    effectiveFrom: Date, effectiveTo: Date
}, { timestamps: true }); timetableSchema.index({
    class: 1, section: 1,
    academicYear: 1
});

module.exports = mongoose.model('Timetable', timetableSchema); 
