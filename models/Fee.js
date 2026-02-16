

const mongoose = require('mongoose');
const feeSchema = new mongoose.Schema({
    student: {
        type:
            mongoose.Schema.Types.ObjectId, ref: 'Student', required: true
    }, academicYear: { type: String, required: true },
    feeStructure: {
        tuition: Number, admission: Number, examination: Number, library: Number, sports: Number, transport:
            Number, hostel: Number, other: Number
    }, totalAmount: { type: Number, required: true }, paidAmount: {
        type: Number,
        default: 0
    }, discount: { type: Number, default: 0 }, dueDate: Date, status: {
        type: String, enum: ['Paid', 'Partial',
            'Pending', 'Overdue'], default: 'Pending'
    }, installments: [{
        amount: Number, dueDate: Date, status: {
            type: String,
            enum: ['Paid', 'Pending', 'Overdue']
        }
    }],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }]
},
    {
        timestamps: true
    }); // Calculate status based on payments
feeSchema.pre('save', function (next) {
    const netAmount = this.totalAmount - this.discount;
    if (this.paidAmount >= netAmount) { this.status = 'Paid'; }
    else if (this.paidAmount > 0) {
        this.status = 'Partial';
    } else if (this.dueDate && new Date() > this.dueDate) {
        this.status = 'Overdue';
    } else {
        this.status = 'Pending';
    } next();
});

feeSchema.index({ student: 1, academicYear: 1 });
module.exports = mongoose.model('Fee', feeSchema); 