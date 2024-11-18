import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAddTeacherMutation } from "../../redux/api/EmptySplit";
import { teacherValidationSchema } from "../../utils/ValidationSchemas";
import { Teacher,AddTeacherProps } from "../../utils/interfaces";
import {text as Texts,buttonText} from "../../utils/constants";

const AddTeacher: React.FC<AddTeacherProps> = ({
  availableCourses,
  fetchTeachers,
  onClose,
  teachers
}) => {
    const [addNewTeacher] = useAddTeacherMutation();

  const initialValues: Teacher = {
    id: null,
    name: "",
    email: "",
    course: "",
    charges: "",
  };

  const onSubmit = async (
    values: Teacher,
    { setSubmitting, resetForm }: any
  ) => {
    try {
        const teacherToAdd = { ...values, charges: parseFloat(values.charges) };
        await addNewTeacher(teacherToAdd)
        await fetchTeachers();
        resetForm();  
        resetForm();
        onClose();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Formik
        initialValues={initialValues}
        validationSchema={teacherValidationSchema(teachers)}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">{Texts.addNewTeacher}</h3>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">
                {Texts.name}
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                {Texts.email}
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="course" className="block text-gray-700">
                {Texts.courses}
              </label>
              <Field
                as="select"
                id="course"
                name="course"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">{Texts.selectedCourse}</option>
                {availableCourses.map((course) => (
                  <option key={course._id} value={course.name}>
                    {course.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="course" component="p" className="text-red-500 text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="charges" className="block text-gray-700">
                {Texts.charges}
              </label>
              <Field
                type="text"
                id="charges"
                name="charges"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="charges" component="p" className="text-red-500 text-sm" />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                {buttonText.cancel}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                {isSubmitting ? "Saving..." : "Save Teacher"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddTeacher;
