import React, { useState, useEffect, ChangeEvent } from 'react';
import DeleteConfirmationModal from './Student/DeleteConfirmmationModal';


interface Course {
  _id: string;
  name: string;
  price: number;
  institute: string;
}

interface FormData {
  name: string;
  price: string;
  institute: string;
}

const CoursesManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    institute: ''
  });

  const fetchCourses = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}course/getcourse`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateUniqueName = (name: string, courseId: string | null = null): boolean => {
    return !courses.some(course => 
      course.name.toLowerCase() === name.toLowerCase() && course._id !== courseId
    );
  };

  const resetForm = (): void => {
    setFormData({ name: '', price: '', institute: '' });
    setIsEditing(false);
    setSelectedCourse(null);
    setIsModalOpen(false);
  };

  const handleEdit = (course: Course): void => {
    setIsEditing(true);
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      price: course.price.toString(),
      institute: course.institute
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!formData.name || !formData.price) {
      alert('Please fill in course name and price');
      return;
    }

    if (!validateUniqueName(formData.name, isEditing ? selectedCourse?._id : null)) {
      alert('A course with this name already exists');
      return;
    }

    const courseData = {
      ...formData,
      price: parseFloat(formData.price)
    };

    try {
      let response: Response;
      if (isEditing && selectedCourse) {
        response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/course/updatecourse/${selectedCourse._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseData),
        });
      } else {
        response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/course/addcourse`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseData),
        });
      }

      if (!response.ok) {
        throw new Error(isEditing ? 'Failed to update course' : 'Failed to add course');
      }

      await response.json();
      fetchCourses();
      resetForm();
    } catch (error) {
      alert(isEditing ? 'Failed to update course' : 'Failed to add course');
    }
  };
  const handleRemoveCourse = (id: string) => {
    setSelectedCourse(courses.find((course) => course._id === id) || null);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/course/deletecourse/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove course');
      fetchCourses();
    } catch (error) {
      alert('Failed to remove course. Please try again.');
    }
    setIsDeleteConfirmOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Courses Management</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          + Add Course
        </button>
      </div>

      {loading && <div className="text-center text-blue-500">Loading courses...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      <div className="space-y-4 mb-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="flex justify-between items-center p-4 border rounded-lg bg-gray-50"
          >
            <div>
              <h3 className="font-semibold text-lg">{course.name}</h3>
              <p className="text-gray-600">Institute: {course.institute}</p>
              <p className="text-blue-600 font-medium">
                Price: ${course.price.toFixed(2)}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(course)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleRemoveCourse(course._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Edit Course' : 'Add New Course'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="course-name" className="block mb-2 font-medium">
                  Course Name
                </label>
                <input
                  id="course-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter course name"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="course-institute" className="block mb-2 font-medium">
                  Institute
                </label>
                <input
                  id="course-institute"
                  name="institute"
                  type="text"
                  value={formData.institute}
                  onChange={handleInputChange}
                  placeholder="Enter institute name"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="course-price" className="block mb-2 font-medium">
                  Price
                </label>
                <input
                  id="course-price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter course price"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={resetForm}
                  className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  {isEditing ? 'Update Course' : 'Add Course'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => confirmDelete(selectedCourse?._id || '')}
        studentName={selectedCourse?.name || null} 
      />
      <div className="mt-4 text-gray-600">
        Total Courses: {courses.length}
      </div>
    </div>
  );
};

export default CoursesManagement;