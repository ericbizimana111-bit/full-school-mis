
const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    user: {
        type:
            mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    }, relation: {
        type: String, required: true, enum:
            ['Father', 'Mother', 'Guardian']
    }, occupation: String, income: Number, students: [{
        type:
            mongoose.Schema.Types.ObjectId, ref: 'Student'
    }], emergencyContact: { name: String, phone: String, relation: String }

}, { timestamps: true });



module.exports = mongoose.model('Parent', parentSchema);




