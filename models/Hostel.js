
const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({

    name: {
        type:
            String, required: true
    }, type: { type: String, enum: ['Boys', 'Girls'], required: true }, capacity: Number, warden: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }, rooms: [{
        number: String, floor: Number, capacity: Number,
        occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], facilities: [String]
    }], fees: {
        monthly: Number,
        security: Number
    }, facilities: [String], rules: [String]
}, { timestamps: true });


module.exports = mongoose.model('Hostel', hostelSchema);