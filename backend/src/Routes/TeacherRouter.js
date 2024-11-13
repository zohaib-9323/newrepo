const express = require('express');
const router = express.Router();
const teacherController = require('../Controllers/TeacherController'); 


router.post('/createteachers', teacherController.createTeacher);

router.get('/getteachers', teacherController.getAllTeachers);

router.get('/teachers/:id', teacherController.getTeacherById);

router.put('/updateteachers/:id', teacherController.updateTeacher);

router.delete('/delteachers/:id', teacherController.deleteTeacher);

module.exports = router;
