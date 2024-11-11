const StudentModel = require("../src/models/Student");


const createStudent = async (req, res) => {
    try {
        const { Name, Department, grade, courses, status } = req.body;
        const normalizedGrade = grade.toUpperCase();
        const validGrades = ['A', 'B', 'C', 'D', 'E', 'F'];
        const validWithModifiers = validGrades.map(g => [g, `${g}+`, `${g}-`]).flat();

        if (!validWithModifiers.includes(normalizedGrade)) {
            return res.status(400).json({ message: "Grade must be one of the following: A, A+, A-, B, B+, B-, C, C+, C-, D, D+, D-, E, E+, E-, F, F+.", success: false });
        }
        if (!Array.isArray(courses) || courses.length > 3) {
            return res.status(400).json({ message: "You can only select up to 3 courses.", success: false });
        }
        const newStudent = new StudentModel({ Name, Department, grade: normalizedGrade, courses, status });
        await newStudent.save();
        res.status(201).json({ message: "Student created successfully", success: true, student: newStudent });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false, error: err });
    }
};


const getAllStudents = async (req, res) => {
    try {
        const students = await StudentModel.find();
        res.status(200).json({ success: true, students });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (updates.courses && (!Array.isArray(updates.courses) || updates.courses.length > 3)) {
            return res.status(400).json({ message: "You can only select up to 3 courses.", success: false });
        }

        const student = await StudentModel.findByIdAndUpdate(id, updates, { new: true });
        
        if (!student) {
            return res.status(404).json({ message: "Student not found", success: false });
        }

        res.status(200).json({ message: "Student updated successfully", success: true, student });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false, err });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await StudentModel.findByIdAndDelete(id);

        if (!student) {
            return res.status(404).json({ message: "Student not found", success: false });
        }

        res.status(200).json({ message: "Student deleted successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
module.exports = {
    createStudent,
    getAllStudents,
    updateStudent,
    deleteStudent
};