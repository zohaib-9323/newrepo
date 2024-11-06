const express = require('express');
const router = express.Router();
const teacherController = require('../Controllers/TeacherController'); // Adjust the path accordingly

// Create a new teacher
router.post('/createteachers', teacherController.createTeacher);

// Get all teachers
router.get('/getteachers', teacherController.getAllTeachers);

// Get teacher by ID
router.get('/teachers/:id', teacherController.getTeacherById);

// Update teacher by ID
router.put('/teachers/:id', teacherController.updateTeacher);

// Delete teacher by ID
router.delete('/delteachers/:id', teacherController.deleteTeacher);

module.exports = router;
