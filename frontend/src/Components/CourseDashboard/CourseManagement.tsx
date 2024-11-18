import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {  useAddCourseMutation, useUpdateCourseMutation, useDeleteCourseMutation, useLazyGetAllCoursesQuery } from '../../redux/api/EmptySplit';
import DeleteConfirmationModal from '../DeleteConfirmation/DeleteConfirmmationModal';
import { courseValidationSchema } from '../../utils/ValidationSchemas';
import { Course,FormData,CoursesResponse } from '../../utils/interfaces';
import {toast} from 'react-toastify'
import {text as Texts,buttonText} from '../../utils/constants'

const CoursesManagement: React.FC = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [getAllCoursesApi, { isLoading, isError }] = useLazyGetAllCoursesQuery();
  const [addCourse] = useAddCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();
  const [error, setError] = useState<string | null>(null);

  const getCourseApiHandler = async (): Promise<void> => {
    try {
      const response = await getAllCoursesApi();
      if (response.data) {
        const coursesData: CoursesResponse = response.data;
        setCourses(coursesData.courses);
      }
    } catch (error) {
      setError("Failed to fetch courses");
    }
  };

  useEffect(() => {
    getCourseApiHandler();
  }, []);


  const validateUniqueName = (name: string, courseId: string | null = null): boolean => {
    return !courses.some(
      (course: Course) => course.name.toLowerCase() === name.toLowerCase() && course._id !== courseId
    );
  };

  const resetForm = (): void => {
    setIsEditing(false);
    setSelectedCourse(null);
    setIsModalOpen(false);
  };

  const handleEdit = (course: Course): void => {
    setIsEditing(true);
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleRemoveCourse = (id: string) => {
    const selectedCourse = courses.find((course: Course) => course._id === id) ?? null;
    setSelectedCourse(selectedCourse);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async (id: string): Promise<void> => {
    try {
      await deleteCourse(id);
      getCourseApiHandler();
      setIsDeleteConfirmOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      toast.error('Failed to remove course. Please try again.');
    }
  };


  const handleSubmit = async (values: FormData): Promise<void> => {
    if (!validateUniqueName(values.name, isEditing ? selectedCourse?._id : null)) {
      toast.error('A course with this name already exists');
      return;
    }

    const courseData = {
      ...values,
      price: parseFloat(values.price),
    };

    try {
      if (isEditing && selectedCourse) {
        await updateCourse(courseData);
      } else {
        await addCourse(courseData);
      }
      getCourseApiHandler();
      resetForm();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update course' : 'Failed to add course');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{Texts.courseManagement}</h2>
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

      {isLoading && <div className="text-center text-blue-500">{Texts.Loading}</div>}
      {isError && <div className="text-center text-red-500">{error}</div>}

      <div className="space-y-4 mb-6">
        {courses.map((course: Course) => (
          <div
            key={course._id}
            className="flex justify-between items-center p-4 border rounded-lg bg-gray-50"
          >
            <div>
              <h3 className="font-semibold text-lg">{course.name}</h3>
              <p className="text-gray-600">{Texts.institute} {course.institute}</p>
              <p className="text-blue-600 font-medium">{Texts.price} ${course.price.toFixed(2)}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(course)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                {buttonText.edit}
              </button>
              <button
                onClick={() => handleRemoveCourse(course._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
              >
                {buttonText.remove}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{isEditing ? 'Edit Course' : 'Add Course'}</h3>
              <button
                onClick={resetForm}
                className="text-gray-600 hover:text-gray-900"
              >
                X
              </button>
            </div>

            <Formik
              initialValues={{
                _id: selectedCourse?._id ?? '',
                name: selectedCourse?.name ?? '',
                price: selectedCourse?.price.toString() ?? '',
                institute: selectedCourse?.institute ?? '',
              }}
              validationSchema={courseValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 mt-4">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium">{Texts.courseName}</label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <label htmlFor="institute" className="block mb-2 font-medium">Institute</label>
                    <Field
                      id="institute"
                      name="institute"
                      type="text"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="institute" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <label htmlFor="price" className="block mb-2 font-medium">Price</label>
                    <Field
                      id="price"
                      name="price"
                      type="number"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
                    >
                      {buttonText.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      {isEditing ? 'Update Course' : 'Add Course'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
      {isDeleteConfirmOpen &&
      <DeleteConfirmationModal
      onClose={() => setIsDeleteConfirmOpen(false)}
      onConfirm={() => confirmDelete(selectedCourse?._id ?? '')}
      studentName={selectedCourse?.name ?? null}
    />}
      <div className="mt-4 text-gray-600">{Texts.totalCourses} {courses.length}</div>
    </div>
  );
};

export default CoursesManagement;

