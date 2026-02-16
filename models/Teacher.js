const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    user: {
        type:
            mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    }, employeeId: {
        type: String, required: true, unique: true
    },
    joiningDate: { type: Date, required: true }, designation: {
        type: String, required: true,
        enum: ['Principal', 'VicePrincipal', 'Senior Teacher', 'Teacher', 'Assistant Teacher', 'Trainee']
    }, department: {
        type: String, required: true
    }, subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }], classes: [{
        class: {
            type:
                mongoose.Schema.Types.ObjectId, ref: 'Class'
        }, section: String, isClassTeacher: { type: Boolean, default: false }
    }],
    qualifications: [{ degree: String, institution: String, year: Number, specialization: String }], experience: [{
        institution: String, designation: String, from: Date, to: Date, description: String
    }], salary: {
        basic: Number,
        allowances: { housing: Number, transport: Number, medical: Number, other: Number }, deductions: {
            tax: Number,
            providentFund: Number, other: Number
        }
    }, bankDetails: {
        accountNumber: String, bankName: String, ifscCode: String,
        branch: String
    }, documents: [{
        type: { type: String, enum: ['resume', 'degree', 'certificate', 'id_proof', 'other'] },
        name: String, url: String, uploadDate: { type: Date, default: Date.now }
    }], performanceReviews: [{
        date: Date,
        reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: { type: Number, min: 1, max: 5 }, comments:
            String, areas: { teaching: Number, discipline: Number, communication: Number, punctuality: Number }
    }], leaves: [{
        type:
            mongoose.Schema.Types.ObjectId, ref: 'Leave'
    }], isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true }, toObject: { virtuals: true }
}); // Indexes teacherSchema.index({ employeeId: 1 });
teacherSchema.index({ department: 1 });


module.exports = mongoose.model('Teacher', teacherSchema);



