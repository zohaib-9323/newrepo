import React, { useState, useEffect } from 'react';
import { useUpdateStudentMutation } from '../../../Services/studentapi';
import { useLazyGetAllCoursesQuery } from '../../../Services/courseapi';

interface StudentCourse {
  id: string;  
  name: string;
}

interface Student {
  id: string;
  Name: string;
  Department: string;
  grade: string;
  status: 'Active' | 'Inactive';
  courses: StudentCourse[]; 
}

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  fetchStudents: () => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  onClose,
  student,
  fetchStudents
}) => {
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableCourses, setAvailableCourses] = useState<StudentCourse[]>([]);
  const [selectedCourseNames, setSelectedCourseNames] = useState<string[]>([]); 
  const [gradeError, setGradeError] = useState<string>('');
  const [updateStudent] = useUpdateStudentMutation();
  const [getAllCoursesApi,{isLoading,isError}]=useLazyGetAllCoursesQuery()

  useEffect(() => {
    if (isOpen && student) {
      setEditStudent(student);
      setSelectedCourseNames(student.courses.map((course) => course.name) || []);
      fetchAvailableCourses();
    } else {
      setSelectedCourseNames([]);
    }
  }, [isOpen, student]);

  const fetchAvailableCourses = async () => {
    try{
      const response = await getAllCoursesApi();
      if (response.data) {
        const coursesData: StudentCourse[] = response.data.courses.map(course => ({ id: course._id, name: course.name }));
        setAvailableCourses(coursesData);
        console.log(coursesData);
      }
    } catch (error) {
          console.error('Error fetching courses:', error);
          alert('Failed to load available courses');
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editStudent) return;
    const { name, value } = e.target;
    setEditStudent(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleCourseToggle = (courseName: string) => {
    setSelectedCourseNames(prev => {
      const isSelected = prev.includes(courseName);
      
      if (isSelected) {
        return prev.filter(name => name !== courseName);
      } else {
        if (prev.length >= 3) {
          alert('You can only select up to 3 courses');
          return prev;
        }
        return [...prev, courseName];
      }
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

  const handleSave = async () => {
    if (!editStudent) return;

    const { Name, grade, Department, status } = editStudent;
    if (!Name || !grade || !Department || selectedCourseNames.length === 0) {
      alert('Please fill in all required fields and select at least one course.');
      return;
    }
    if (!validateGrade(grade)) {
      return; 
    }

    const studentToUpdate = {
      id: editStudent.id,
      Name,
      grade,
      Department,
      courses: selectedCourseNames, 
      status,
    };

    try {
      setLoading(true);
      const response = await updateStudent(studentToUpdate).unwrap();
      if (response.message){
        alert('Student details updated successfully!');
      }
      fetchStudents();
      onClose();
    } catch (error) {
      console.error('Failed to update student:', error);
      alert('Failed to update student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !editStudent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Student</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="Name"
              type="text"
              value={editStudent.Name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <input
              name="grade"
              type="text"
              value={editStudent.grade}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {gradeError && <p className="text-red-500 text-sm">{gradeError}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              name="Department"
              type="text"
              value={editStudent.Department}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={editStudent.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Courses (Select up to 3)
            </label>
            <div className="border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
              {availableCourses.map((course) => {
                const isSelected = selectedCourseNames.includes(course.name);
                return (
                  <div 
                    key={course.id} 
                    className={`flex items-center space-x-3 p-2 rounded ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={course.id}
                      checked={isSelected}
                      onChange={() => handleCourseToggle(course.name)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={course.id} className="flex-1 cursor-pointer">
                      <div className="text-sm font-medium">{course.name}</div>
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Selected: {selectedCourseNames.length}/3
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default EditStudentModal;