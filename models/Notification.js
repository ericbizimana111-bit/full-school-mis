const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    }, title: { type: String, required: true }, message: { type: String, required: true }, type:
        { type: String, enum: ['Info', 'Warning', 'Alert', 'Success'], default: 'Info' }, category: {
            type: String, enum:
                ['Attendance', 'Grade', 'Fee', 'Assignment', 'Event', 'Announcement', 'Leave', 'Other'], required: true
        }, relatedId:
        mongoose.Schema.Types.ObjectId, isRead: { type: Boolean, default: false }, readAt: Date
}, { timestamps: true });


notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });


module.exports = mongoose.model('Notification', notificationSchema);