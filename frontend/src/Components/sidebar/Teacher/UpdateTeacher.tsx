import React, { useState, useEffect } from 'react';

interface Teacher {
    id: number | null;
    name: string;
    email: string;
    course: string;
    charges: string;
  }

interface Course {
  _id: string;
  name: string;
}

interface UpdateTeacherProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  fetchTeachers: () => void;
}

const UpdateTeacher: React.FC<UpdateTeacherProps> = ({
  isOpen,
  onClose,
  teacher,
  fetchTeachers,
}) => {
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourseName, setSelectedCourseName] = useState<string>(''); // Single course

  useEffect(() => {
    if (isOpen && teacher) {
      setEditTeacher(teacher);
      setSelectedCourseName(teacher.course || '');
      fetchAvailableCourses();
    }
  }, [isOpen, teacher]);

  const fetchAvailableCourses = async () => {
    try {
      const response = await fetch('http://localhost:5007/course/getcourse');
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setAvailableCourses(data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Failed to load available courses');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editTeacher) return;
    const { name, value } = e.target;
    setEditTeacher(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (!editTeacher) return;

    const { name, email, charges } = editTeacher;
    if (!name || !email || !selectedCourseName) {
      alert('Please fill in all required fields.');
      return;
    }

    const teacherToUpdate = {
      name,
      email,
      course: selectedCourseName,
      charges: parseFloat(charges as string) || 0,
    };

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5007/teacher/updateteachers/${editTeacher.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherToUpdate),
      });

      if (!response.ok) throw new Error('Failed to update teacher');
      
      await response.json();
      alert('Teacher details updated successfully!');
      fetchTeachers();
      onClose();
    } catch (error) {
      console.error('Failed to update teacher:', error);
      alert('Failed to update teacher. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !editTeacher) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Teacher</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name"
              type="text"
              value={editTeacher.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={editTeacher.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select
              name="course"
              value={selectedCourseName}
              onChange={(e) => setSelectedCourseName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Course</option>
              {availableCourses.map(course => (
                <option key={course._id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Charges</label>
            <input
              name="charges"
              type="text"
              value={editTeacher.charges}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
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

export default UpdateTeacher;
