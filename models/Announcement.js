const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true }, content: { type: String, required: true }, type: {
        type: String, enum:
            ['General', 'Urgent', 'Academic', 'Administrative', 'Event'], default: 'General'
    }, priority: {
        type: String, enum:
            ['High', 'Medium', 'Low'], default: 'Medium'
    }, publishedBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    }, targetAudience: {
        students: Boolean, teachers: Boolean, parents: Boolean, classes: [{
            type:
                mongoose.Schema.Types.ObjectId, ref: 'Class'
        }]
    }, attachments: [{ name: String, url: String }], publishDate: {
        type:
            Date, default: Date.now
    }, expiryDate: Date, isActive: { type: Boolean, default: true }
}, { timestamps: true });

announcementSchema.index({ publishDate: -1 });

module.exports = mongoose.model('Announcement', announcementSchema); 