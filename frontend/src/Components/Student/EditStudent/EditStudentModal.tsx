import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useUpdateStudentMutation,useLazyGetAllCoursesQuery } from '../../../redux/api/EmptySplit';
import { studentValidationSchema } from '../../../utils/ValidationSchemas';
import { StudentCourse,Student,EditStudentModalProps } from '../../../utils/interfaces';
import { toast } from 'react-toastify';
import {text as Texts,buttonText} from '../../../utils/constants';

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  onClose,
  student,
  fetchStudents,
}) => {
  const [loading, setLoading] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<StudentCourse[]>([]);
  const [updateStudent] = useUpdateStudentMutation();
  const [getAllCoursesApi] = useLazyGetAllCoursesQuery();

  const fetchAvailableCourses = async ():Promise<void> => {
    try {
      const response = await getAllCoursesApi();
      if (response.data) {
        const coursesData: StudentCourse[] = response.data.courses.map((course: any) => ({
          id: course._id,
          name: course.name,
        }));
        setAvailableCourses(coursesData);
      }
    } catch (error) {
      toast.error('Failed to load available courses');
    }
  };

  useEffect(() => {
    if (isOpen && student) {
      fetchAvailableCourses();
    }
  }, [isOpen, student]);

  const handleSave = async (values:any):Promise<void> => {
    try {
      setLoading(true);
      const response = await updateStudent({
        id: student!.id,
        ...values,
      })
      if (response.data?.success) { 
        toast.success('Student details updated successfully!');
      }
      fetchStudents();
      onClose();
    } catch (error) {
      toast.error('Failed to update student. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{Texts.editstudent}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <Formik
          initialValues={{
            Name: student.Name,
            grade: student.grade,
            Department: student.Department,
            status: student.status,
            courses: student.courses.map((c) => c.name),
          }}
          validationSchema={studentValidationSchema}
          onSubmit={handleSave}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{Texts.name}</label>
                <Field
                  name="Name"
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="Name" component="p" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{Texts.grade}</label>
                <Field
                  name="grade"
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="grade" component="p" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{Texts.department}</label>
                <Field
                  name="Department"
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="Department" component="p" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{Texts.status}</label>
                <Field
                  as="select"
                  name="status"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">{Texts.active}</option>
                  <option value="Inactive">{Texts.inactive}</option>
                </Field>
                <ErrorMessage name="status" component="p" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {Texts.availableCourses}
                </label>
                <div className="border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                  {availableCourses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-3 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={values.courses.includes(course.name)}
                        onChange={(e) => {
                          const selectedCourses = [...values.courses];
                          if (e.target.checked) {
                            if (selectedCourses.length < 3) {
                              setFieldValue('courses', [...selectedCourses, course.name]);
                            } else {
                              toast('You can only select up to 3 courses');
                            }
                          } else {
                            setFieldValue(
                              'courses',
                              selectedCourses.filter((name) => name !== course.name)
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="flex-1 cursor-pointer text-sm">{course.name}</label>
                    </div>
                  ))}
                </div>
                <ErrorMessage name="courses" component="p" className="text-red-500 text-sm" />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  {buttonText.cancel}
                </button>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditStudentModal;
