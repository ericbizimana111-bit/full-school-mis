const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },

    admissionNumber: {
        type: String,
        required: true,
        unique: true
    },

    admissionDate: {
        type: Date, required: true, default: Date.now
    },

    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },

    section: {
        type: String,
        required: true
    },


    rollNumber: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },

    parents:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Parent'
        }],

    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },


    medicalConditions:
        [String], allergies: [String], emergencyContact: {
            name: String,
            relationship: String, phone: String
        },

    previousSchool: {
        name: String,
        address: String,
        lastClass: String
    },

    documents:
        [{
            type: {
                type: String,
                enum: ['birth_certificate', 'transfer_certificate', 'marksheet', 'other']
            },
            name: String,
            url:
                String, uploadDate: { type: Date, default: Date.now }
        }],


    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    },

    transport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transport'
    },

    status: {
        type: String,
        enum: ['active', 'inactive', 'graduated', 'transferred', 'expelled'],
        default: 'active'
    },

    achievements: [{
        title: String, description:
            String, date: Date,
        category: {
            type: String,
            enum: ['academic', 'sports', 'arts', 'other']
        }
    }],


    disciplinaryRecords:
        [{
            date: Date,
            incident: String,
            action: String,
            reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
        }]
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

// Indexes
studentSchema.index({ class: 1, section: 1 });
studentSchema.index({ academicYear: 1 });

//Virtual populate for attendance//

studentSchema.virtual(
    'attendance', {
    ref: 'Attendance',
    localField: '_id',
    foreignField: 'student'
});

// Virtual populate for grades studentSchema.virtual('grades', { ref: 'Grade', localField:'_id', foreignField: 'student' });


module.exports = mongoose.model('Student', studentSchema);


