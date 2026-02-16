

const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({

    vehicleNumber: {
        type: String,
        required: true,
        unique: true
    },
    vehicleType: {
        type: String,
        enum: ['Bus', 'Van', 'Car'],
        required: true
    },
    capacity: Number,
    driver: {
        name: String,
        phone: String,
        licenseNumber: String
    },
    routes: [{
        name: String,
        stops: [{
            name: String, time: String,
            location: { latitude: Number, longitude: Number }
        }],
        fare: Number
    }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    maintenance: [{
        date: Date, type: String, cost:
            Number, description: String
    }],
    status: {
        type: String, enum: ['Active', 'Maintenance', 'Inactive'],
        default: 'Active'
    }
}, { timestamps: true });


module.exports = mongoose.model('Transport', transportSchema);