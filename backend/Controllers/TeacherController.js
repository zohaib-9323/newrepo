const TeacherModel = require('../models/Teachers'); // Adjust the path according to your project structure

// Create a new teacher
exports.createTeacher = async (req, res) => {
    try {
        const { name, email, course, charges } = req.body;

        // Check if the teacher already exists by email
        const existingTeacher = await TeacherModel.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: 'Teacher with this email already exists' });
        }

        // Create a new teacher
        const newTeacher = new TeacherModel({ name, email, course, charges });
        await newTeacher.save();

        return res.status(201).json({ message: 'Teacher created successfully', teacher: newTeacher });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating teacher', error: error.message });
    }
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await TeacherModel.find();
        return res.status(200).json({ teachers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching teachers', error: error.message });
    }
};

// Get a single teacher by ID
exports.getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await TeacherModel.findById(id);

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        return res.status(200).json({ teacher });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching teacher', error: error.message });
    }
};

// Update teacher by ID
exports.updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, course, charges } = req.body;

        // Find and update the teacher by ID
        const updatedTeacher = await TeacherModel.findByIdAndUpdate(
            id,
            { name, email, course, charges },
            { new: true }
        );

        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        return res.status(200).json({ message: 'Teacher updated successfully', teacher: updatedTeacher });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating teacher', error: error.message });
    }
};

// Delete teacher by ID
exports.deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTeacher = await TeacherModel.findByIdAndDelete(id);

        if (!deletedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        return res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting teacher', error: error.message });
    }
};
