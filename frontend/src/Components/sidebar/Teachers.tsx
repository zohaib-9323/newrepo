import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DeleteConfirmationModal from "./Student/DeleteConfirmmationModal";
import UpdateTeacher from "./Teacher/UpdateTeacher";
import {
  useLazyGetAllTeachersQuery,
  useAddTeacherMutation,
  useDeleteTeacherMutation,
} from "../../Services/teacherapi";
import {  useLazyGetAllCoursesQuery} from "../../Services/courseapi";

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
  price: number;
  institute: string;
}

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [getAllCoursesApi] = useLazyGetAllCoursesQuery();
  const [getAllTeachers] = useLazyGetAllTeachersQuery();
  const [addNewTeacher] = useAddTeacherMutation();
  const [deleteTeacher] = useDeleteTeacherMutation();


  const fetchData = async () => {
    try {
      const response = await getAllTeachers();
      if (response.data) {
        const transformedTeachers = response.data.teachers.map((teacher: any) => ({
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          course: teacher.course || "",
          charges: teacher.charges || "",
        }));
        setTeachers(transformedTeachers);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await getAllCoursesApi();
      if (response.data) {
        setAvailableCourses(response.data.courses || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAvailableCourses();
  }, []);
  
  const initialValues={
    id:null,
    name: "",
    email: "",
    course: "",
    charges: "",
  }


  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .test("unique-email", "A teacher with this email already exists", (value) =>
        teachers.every((teacher) => teacher.email !== value)
      )
      .required("Email is required"),
    course: Yup.string().required("Please select a course"),
    charges: Yup.number()
      .typeError("Charges must be a valid number")
      .positive("Charges must be greater than zero")
      .required("Charges are required"),
  });


  const handleSubmit = async (values: Teacher, { resetForm }: any) => {
    try {
      const teacherToAdd = { ...values, charges: parseFloat(values.charges) };
      await addNewTeacher(teacherToAdd).unwrap();
      fetchData();
      resetForm();
      setIsAddingTeacher(false);
    } catch (error) {
      console.error("Failed to add teacher:", error);
    }
  };
  const removeTeacher = (id: number) => {
    setSelectedTeacher(teachers.find((teacher) => teacher.id === id) || null);
    setIsDeleteConfirmOpen(true);
  };
  const confirmDelete = async (id: number) => {
    try {
      await deleteTeacher(id).unwrap();
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
    setIsDeleteConfirmOpen(false);
  };
      const handleEditClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Teachers</h2>
        <button
          onClick={() => setIsAddingTeacher(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          + Add Teacher
        </button>
      </div>

      {teachers.length === 0 ? (
        <p className="text-gray-500 text-center">No teachers available</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="flex justify-between items-center py-4">
              <div>
                <p className="font-medium text-gray-800">{teacher.name}</p>
                <p className="text-gray-600">{teacher.email}</p>
                <p className="text-gray-600">{teacher.course}</p>
                <p className="text-gray-600">Charges: {teacher.charges}</p>
              </div>
              <div>
                <button
                  onClick={() => handleEditClick(teacher)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 mr-2">
                  Edit
                </button>
                <button
                  onClick={() => removeTeacher(teacher.id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAddingTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Add New Teacher</h3>

                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Course</label>
                  <Field
                    as="select"
                    name="course"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a Course</option>
                    {availableCourses.map((course) => (
                      <option key={course._id} value={course.name}>
                        {course.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="course" component="p" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Charges</label>
                  <Field
                    type="text"
                    name="charges"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="charges" component="p" className="text-red-500 text-sm" />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsAddingTeacher(false)}
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                  >
                    Cancel
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
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => confirmDelete(selectedTeacher?.id || 0)}
        studentName={selectedTeacher?.name || ""}
      />
      {selectedTeacher && (
        <UpdateTeacher
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          teacher={selectedTeacher}
          fetchTeachers={fetchData}
        />
      )}
    </div>
  );
};

export default TeacherManagement;
