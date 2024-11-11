const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Department: 
    {   type: String, 
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    courses: {
        type: [String], 
        validate: {
            validator: function(v) {
                return v.length <= 3; 
            },
            message: 'You can only choose up to 3 courses.'
        },
        required: true
    },
    status:{
        type: String,
        required: true,
        enum: ['Active', 'Inactive']
    }
});


const StudentModel = mongoose.model('StudentData', StudentSchema);

module.exports = StudentModel;
