const express = require('express');
const {
    createCourse,
    getAllCourses,
    updateCourse,
    deleteCourse
} = require('../Controllers/CourseController');
const router = express.Router();

router.get('/getcourse', getAllCourses);
router.post('/addcourse', createCourse);
router.put('/updatecourse', updateCourse);
router.delete('/deletecourse/:id', deleteCourse);

module.exports = router;
