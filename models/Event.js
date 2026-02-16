
const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
    
    title: { type: String, required: true }, description: String, type: {
        type:
            String, enum: ['Academic', 'Sports', 'Cultural', 'Holiday', 'Meeting', 'Other'], required: true
    }, startDate: {
        type:
            Date, required: true
    }, endDate: Date, startTime: String, endTime: String, location: String, organizer: {
        type:
            mongoose.Schema.Types.ObjectId, ref: 'User'
    }, participants: {
        classes: [{
            type: mongoose.Schema.Types.ObjectId, ref:
                'Class'
        }], students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], teachers: [{
            type:
                mongoose.Schema.Types.ObjectId, ref: 'Teacher'
        }]
    }, attachments: [{ name: String, url: String }], status: {
        type:
            String, enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'], default: 'Scheduled'
    }
}, { timestamps: true });
eventSchema.index({ startDate: 1 }); 

module.exports = mongoose.model('Event', eventSchema); 