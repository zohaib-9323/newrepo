const express = require('express');
const {
    createStudent,
    getAllStudents,
    updateStudent,
    deleteStudent
} = require('../Controllers/StudentController'); 
const router = express.Router();

router.post('/creatstudent', createStudent);

router.get('/getstudent', getAllStudents);

router.put('/updatestudent/:id', updateStudent);

router.delete('/deletestudent/:id', deleteStudent);

module.exports = router;
