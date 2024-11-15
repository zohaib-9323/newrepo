import React, { useEffect, useState } from 'react';
import { useAddStudentMutation } from '../../../Services/studentapi';
import { useLazyGetAllCoursesQuery } from '../../../Services/courseapi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchStudents: () => void;
}

interface Course {
  _id: string;
  name: string;
  institute: string;
  price: number;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, fetchStudents }) => {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [addStudent] = useAddStudentMutation();
  const [getAllCoursesApi] = useLazyGetAllCoursesQuery();

  useEffect(() => {
    if (isOpen) {
      fetchAvailableCourses();
    }
  }, [isOpen]);

  const fetchAvailableCourses = async () => {
    try {
      const response = await getAllCoursesApi();
      if (response.data) {
        setAvailableCourses(response.data.courses || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Failed to load available courses');
    }
  };

  const initialValues = {
    Name: '',
    grade: '',
    Department: '',
    status: 'Active',
    courses: [] as string[],
  };

  const validationSchema = Yup.object({
    Name: Yup.string().required('Name is required'),
    grade: Yup.string()
      .required('Grade is required')
      .matches(
        /^[A-F]([+-])?$/i,
        'Grade must be one of the following: A, A+, A-, B, B+, B-, C, C+, C-, D, D+, D-, E, E+, E-, F, F+.'
      ),
    Department: Yup.string().required('Department is required'),
    courses: Yup.array()
      .of(Yup.string())
      .min(1, 'Select at least one course')
      .max(3, 'You can select up to 3 courses'),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    try {
      await addStudent(values).unwrap();
      alert('Student added successfully!');
      fetchStudents();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to add student:', error);
      alert('Failed to add student. Please try again.');
    } finally {
      setSubmitting(false);
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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  name="Name"
                  type="text"
                  placeholder="Enter student name"
                  className="w-full px-3 py-2 border rounded"
                />
                <ErrorMessage name="Name" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field
                  name="grade"
                  type="text"
                  placeholder="Enter student grade"
                  className="w-full px-3 py-2 border rounded"
                />
                <ErrorMessage name="grade" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field
                  name="Department"
                  type="text"
                  placeholder="Enter student department"
                  className="w-full px-3 py-2 border rounded"
                />
                <ErrorMessage name="Department" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field as="select" name="status" className="w-full px-3 py-2 border rounded">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Field>
              </div>

              <div className="space-y-2">
                <label className="block font-medium">
                  Select Courses ({values.courses.length}/3):
                </label>
                <div className="max-h-40 overflow-y-auto border rounded p-2">
                  {availableCourses.map((course) => (
                    <div key={course._id} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        id={course._id}
                        checked={values.courses.includes(course.name)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const updatedCourses = isChecked
                            ? [...values.courses, course.name]
                            : values.courses.filter((name) => name !== course.name);
                          setFieldValue('courses', updatedCourses);
                        }}
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
                <ErrorMessage name="courses" component="div" className="text-red-500 text-sm" />
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Student'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddStudentModal;
