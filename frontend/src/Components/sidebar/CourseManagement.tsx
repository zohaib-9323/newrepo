import React, { useState, ChangeEvent,useEffect } from 'react';
import { useGetAllCoursesQuery, useAddCourseMutation, useUpdateCourseMutation, useDeleteCourseMutation, useLazyGetAllCoursesQuery } from '../../Services/courseapi';
import DeleteConfirmationModal from './Student/DeleteConfirmmationModal';

interface Course {
  _id: string;
  name: string;
  price: number;
  institute: string;
}

interface FormData {
  _id: string;
  name: string;
  price: string;
  institute: string;
}
interface CoursesResponse {
  message: string;
  courses: Course[];
}

const CoursesManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    _id: '',
    name: '',
    price: '',
    institute: '',
  });
const [courses, setCourses] = useState<Course[]>([]);
  const [getAllCoursesApi,{isLoading,isError}]=useLazyGetAllCoursesQuery()
  const [addCourse] = useAddCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();
  const [error, setError] = useState<string | null>(null);

 
 
  const getCourseApiHandler = async () => {
    try {
      const response = await getAllCoursesApi();
      if (response.data) {
        const coursesData: CoursesResponse = response.data;
        setCourses(coursesData.courses);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setError("Failed to fetch courses");
    }
  };

  useEffect(() => {
    getCourseApiHandler();
  }, []);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateUniqueName = (name: string, courseId: string | null = null): boolean => {
    return !courses.some(
      (course: Course) => course.name.toLowerCase() === name.toLowerCase() && course._id !== courseId
    );
  };

  const resetForm = (): void => {
    setFormData({ _id:'',name: '', price: '', institute: '' });
    setIsEditing(false);
    setSelectedCourse(null);
    setIsModalOpen(false);
  };

  const handleEdit = (course: Course): void => {
    setIsEditing(true);
    setSelectedCourse(course);
    setFormData({
      _id: course._id,
      name: course.name,
      price: course.price.toString(),
      institute: course.institute,
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
      price: parseFloat(formData.price),
    };

    try {
      if (isEditing && selectedCourse) {
        await updateCourse(courseData); 
        getCourseApiHandler();
      } else {
        await addCourse(courseData); 
        getCourseApiHandler();
      }
      resetForm();
    } catch (error) {
      alert(isEditing ? 'Failed to update course' : 'Failed to add course');
    }
  };

  const handleRemoveCourse = (id: string) => {
    const selectedCourse = courses.find((course: Course) => course._id === id) || null;
    setSelectedCourse(selectedCourse);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async (id: string): Promise<void> => {
    try {
      await deleteCourse(id); 
    } catch (error) {
      alert('Failed to remove course. Please try again.');
    }
    getCourseApiHandler();
    setIsDeleteConfirmOpen(false);
    setSelectedCourse(null);
  };

  return (
    // <div>testing</div>
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

      {isLoading && <div className="text-center text-blue-500">Loading courses...</div>}
      {isError && <div className="text-center text-red-500">{(error as any).message}</div>}

      <div className="space-y-4 mb-6">
        {courses.map((course: Course) => (
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
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {isEditing ? 'Edit Course' : 'Add Course'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-600 hover:text-gray-900"
              >
                X
              </button>
            </div>

              <div className="space-y-4 mt-4">
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
