const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: {  
        type: String,
        required: true
    },
    institute: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const CourseModel = mongoose.model('CourseData', CourseSchema);

module.exports = CourseModel;
