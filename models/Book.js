const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true }, author: { type: String, required: true }, isbn: {
        type:
            String, unique: true, required: true
    },
    publisher: String, publishedYear: Number, category: {
        type: String, required:
            true, enum: ['Fiction', 'Non-Fiction', 'Science', 'Mathematics', 'History', 'Geography', 'Language', 'Reference',
                'Other']
    },
    copies: {
        total: {
            type: Number, required: true,
            default: 1
        },
        available: { type: Number, required: true }
    },
    location: { shelf: String, row: String },
    borrowHistory: [{
        student: {
            type: mongoose.Schema.Types.ObjectId, ref:
                'Student'
        }, borrowDate: Date, returnDate: Date, actualReturnDate: Date, status: {
            type: String, enum: ['Borrowed',
                'Returned', 'Lost', 'Damaged']
        }, fine: Number
    }],
    currentBorrowers: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }, borrowDate: Date, dueDate: Date
    }]
},
    { timestamps: true });

bookSchema.index({ isbn: 1 });
bookSchema.index({ category: 1 });

module.exports = mongoose.model('Book', bookSchema);
