

const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({


    name: {
        type: String,
        required: true
    },
    location: String,
    capacity: Number,
    workingHours: { opening: String, closing: String },
    librarian: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
},

    { timestamps: true });


module.exports = mongoose.model('Library', librarySchema); 