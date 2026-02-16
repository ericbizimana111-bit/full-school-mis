const mongoose = require('mongoose');


const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: String,
    type:
        { type: String, enum: ['Core', 'Elective', 'Optional'], default: 'Core' }, totalMarks: { type: Number, default: 100 },
    passingMarks: { type: Number, default: 33 },
    credits: Number, classes: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Class'
    }]

},
    { timestamps: true });


module.exports = mongoose.model('Subject', subjectSchema);


