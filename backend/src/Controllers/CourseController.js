const CourseModel = require('../models/Courses');

const createCourse = async (req, res) => {
    try {
        const { name, institute, price } = req.body;

        if (!name || !institute || !price) {
            return res.status(400).json({ message: 'All fields (name, institute, price) are required', success: false });
        }

        const newCourse = new CourseModel({ name, institute, price });
        await newCourse.save();
        res.status(201).json({ message: 'Course created successfully', success: true, course: newCourse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};


const getAllCourses = async (req, res) => {
    try {
        const courses = await CourseModel.find();
        res.status(200).json({ success: true, courses });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, institute, price } = req.body;

        if (!name || !institute || !price) {
            return res.status(400).json({ message: 'All fields (name, institute, price) are required for updating', success: false });
        }

        const updatedCourse = await CourseModel.findByIdAndUpdate(id, { name, institute, price }, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found', success: false });
        }

        res.status(200).json({ message: 'Course updated successfully', success: true, course: updatedCourse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false, error: err });
    }
};


const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCourse = await CourseModel.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found', success: false });
        }

        res.status(200).json({ message: 'Course deleted successfully', success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    updateCourse,
    deleteCourse,
};
