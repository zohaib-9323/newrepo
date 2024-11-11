const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    course: {
        type: String,
        required: true
    },
    charges: {
        type: Number,
        required: true
    }
});

const TeacherModel = mongoose.model('TeacherData', TeacherSchema);

module.exports = TeacherModel;
