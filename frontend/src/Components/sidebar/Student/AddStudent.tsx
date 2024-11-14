import React, { useState, useEffect } from 'react';
import { useAddStudentMutation } from '../../../Services/studentapi';
import { useLazyGetAllCoursesQuery } from '../../../Services/courseapi';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchStudents: () => void;
}

interface Student {
  id: string;
  Name: string;
  Department: string;
  grade: string;
  status: 'Active' | 'Inactive';
  courses: string[]; 
}

interface Course {
  _id: string;
  name: string;
  institute: string;
  price: number;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, fetchStudents }) => {
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
    Name: '',
    grade: '',
    Department: '',
    status: 'Active',
    courses: [],
  });
  const [loading, setLoading] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [courseError, setCourseError] = useState<string>('');
  const [gradeError, setGradeError] = useState<string>('');
  const [addStudent] = useAddStudentMutation();
  const [getAllCoursesApi,{isLoading,isError}]=useLazyGetAllCoursesQuery()
  useEffect(() => {
    if (isOpen) {
      fetchAvailableCourses();
    }
  }, [isOpen]);

  const fetchAvailableCourses = async () => {
    try{
      const response = await getAllCoursesApi();
      if (response.data) {
        const coursesData: Course[] = response.data?.courses || [];
        setAvailableCourses(coursesData);
        console.log(coursesData);
      }
    } catch (error) {
          console.error('Error fetching courses:', error);
          alert('Failed to load available courses');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCourseSelection = (course: Course) => {
    setNewStudent((prev) => {
      const isSelected = prev.courses.includes(course.name);
      let updatedCourses;

      if (isSelected) {
        updatedCourses = prev.courses.filter(name => name !== course.name);
      } else {
        if (prev.courses.length >= 3) {
          setCourseError('You can select a maximum of 3 courses.');
          return prev;
        }
        updatedCourses = [...prev.courses, course.name];
      }

      setCourseError('');
      return {
        ...prev,
        courses: updatedCourses,
      };
    });
  };


  const validateGrade = (grade: string) => {
    const validGrades = ['A', 'B', 'C', 'D', 'E', 'F'];
    const validWithModifiers = validGrades.map(g => [g, `${g}+`, `${g}-`]).flat();

    if (!validWithModifiers.includes(grade.toUpperCase())) {
      setGradeError('Grade must be one of the following: A, A+, A-, B, B+, B-, C, C+, C-, D, D+, D-, E, E+, E-, F, F+.');
      return false;
    }

    setGradeError('');
    return true;
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const { Name, grade, Department, courses } = newStudent;
    if (!Name || !grade || !Department || courses.length === 0) {
      alert('Please fill in all required fields and select at least one course.');
      return;
    }
    if (!validateGrade(grade)) {
      return; 
    }
    const studentToAdd = {
      Name,
      grade,
      Department,
      courses, 
      status: newStudent.status,
    };
  
    try {
      setLoading(true);
      await addStudent(studentToAdd).unwrap();
      alert('Student added successfully!');
      fetchStudents(); 
      setNewStudent({ Name: '', grade: '', Department: '', status: 'Active', courses: [] }); 
      onClose(); 
    } catch (error) {
      console.error('Failed to add student:', error);
      alert('Failed to add student. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Student</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <form onSubmit={handleAddStudent} className="space-y-4">
          <input
            name="Name"
            type="text"
            placeholder="Enter student name"
            value={newStudent.Name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            name="grade"
            type="text"
            placeholder="Enter student grade"
            value={newStudent.grade}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          {gradeError && <p className="text-red-500 text-sm">{gradeError}</p>}
          <input
            name="Department"
            type="text"
            placeholder="Enter student department"
            value={newStudent.Department}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <select
            name="status"
            value={newStudent.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="space-y-2">
            <label className="block font-medium">
              Select Courses ({newStudent.courses.length}/3):
            </label>
            <div className="max-h-40 overflow-y-auto border rounded p-2">
              {availableCourses.map((course) => (
                <div key={course._id} className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    id={course._id}
                    checked={newStudent.courses.includes(course.name)}
                    onChange={() => handleCourseSelection(course)}
                    className="rounded"
                  />
                  <label htmlFor={course._id} className="flex-1">
                    <span className="font-medium">{course.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({course.institute} - ${course.price})
                    </span>
                  </label>
                </div>
              ))}
            </div>
            {courseError && <p className="text-red-500 text-sm">{courseError}</p>}
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Selected Courses:</label>
            <div className="text-sm text-gray-600">
              {newStudent.courses.map((courseName, index) => (
                <div key={index}>
                  {index + 1}. {courseName}
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={loading || newStudent.courses.length > 3}
            >
              {loading ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
