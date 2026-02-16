const mongoose = require('mongoose');
const assignmentSchema = new mongoose.Schema({
    
    title: {
        type: String, required: true
    }, description: String, subject: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Subject',
        required: true
    }, class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }, section: String,
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }, assignedDate: {
        type: Date,
        default: Date.now
    }, dueDate: { type: Date, required: true }, totalMarks: Number, attachments: [{
        name: String, url:
            String, type: String
    }], submissions: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        submittedDate: Date, attachments: [{ name: String, url: String }], marks: Number, feedback: String, status: {
            type:
                String, enum: ['Submitted', 'Late', 'Not Submitted', 'Graded'], default: 'Not Submitted'
        }
    }], academicYear: String
}, {
    timestamps: true
});


module.exports = mongoose.model('Assignment', assignmentSchema); 
