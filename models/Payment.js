
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

    fee: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, amount: {
        type: Number, required:
            true
    }, paymentDate: { type: Date, default: Date.now }, paymentMethod: {
        type: String, enum: ['Cash', 'Cheque',
            'Online', 'Card', 'Bank Transfer'], required: true
    }, transactionId: String, receiptNumber: {
        type: String, unique:
            true, required: true
    }, remarks: String, receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
}); // Generate receipt number 

paymentSchema.pre('save', async function (next) {
    if (!this.receiptNumber) {
        const count = await this.constructor.countDocuments();
        this.receiptNumber = `REC${new Date().getFullYear()}${String(count + 1).padStart(6, '0')} `;
    } next();
});


module.exports = mongoose.model('Payment', paymentSchema);

