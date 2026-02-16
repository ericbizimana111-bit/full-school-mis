const mongoose = require('mongoose');


const classSchema = new mongoose.Schema({
    name: {
        type:
            String, required: true, unique: true
    }, grade: { type: Number, required: true }, sections: [{
        name: String, capacity:
            Number, classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
    }], subjects: [{
        type:
            mongoose.Schema.Types.ObjectId, ref: 'Subject'
    }], academicYear: { type: String, required: true }, fees: {
        tuition:
            Number, admission: Number, examination: Number, library: Number, sports: Number, transport: Number, other: Number
    }
}, {
    timestamps: true

}); classSchema.index({ academicYear: 1 });



module.exports = mongoose.model('Class', classSchema);

