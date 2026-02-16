
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, userType: {
        type: String, enum: ['Teacher',
            'Student'], required: true
    }, leaveType: {
        type: String, enum: ['Sick', 'Casual', 'Emergency', 'Maternity', 'Paternity',
            'Other'], required: true
    }, startDate: { type: Date, required: true }, endDate: { type: Date, required: true }, reason:
        { type: String, required: true }, supportingDocuments: [{ name: String, url: String }], status: {
            type: String, enum:
                ['Pending', 'Approved', 'Rejected'], default: 'Pending'
        }, approvedBy: {
            type: mongoose.Schema.Types.ObjectId, ref:
                'User'
        }, approvalDate: Date, remarks: String
}, { timestamps: true });

leaveSchema.index({ user: 1, startDate: -1 });
module.exports = mongoose.model('Leave', leaveSchema);


