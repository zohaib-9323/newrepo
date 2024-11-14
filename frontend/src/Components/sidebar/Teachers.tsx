import React, { useState, useEffect } from "react";
import DeleteConfirmationModal from "./Student/DeleteConfirmmationModal";
import UpdateTeacher from "./Teacher/UpdateTeacher";
import { useLazyGetAllCoursesQuery } from '../../Services/courseapi';
import { 
  useLazyGetAllTeachersQuery,
  useAddTeacherMutation,
  useDeleteTeacherMutation,
  useUpdateTeacherMutation
} from "../../Services/teacherapi";


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
interface TeachersResponse {
  message: string;
  teachers: Teacher[];
}

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [isAddingTeacher, setIsAddingTeacher] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState<Teacher>({
    id: null,
    name: "",
    email: "",
    course: "",
    charges: "",
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [getAllCoursesApi]=useLazyGetAllCoursesQuery()
  const[getAllTeachers]=useLazyGetAllTeachersQuery();
  const [addNewTeacher] = useAddTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();
  const [deleteTeacher] = useDeleteTeacherMutation();

  const fetchData = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await getAllTeachers();
      if(response.data){
        const teachersData: TeachersResponse = response.data;
        const transformedTeachers = teachersData.teachers.map((teacher: any) => ({
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          course: teacher.course || "",
          charges: teacher.charges || "",
        }));
        setTeachers(transformedTeachers);
      }    
    } catch (error) {
      setErrorMessage("Error fetching data. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try{
      const response = await getAllCoursesApi();
      if (response.data) {
        const coursesData: Course[] = response.data?.courses || [];
        setAvailableCourses(coursesData);
      }
    } catch (error) {
          console.error('Error fetching courses:', error);
          alert('Failed to load available courses');
    }
  };

  useEffect(() => {
    fetchData();
    fetchAvailableCourses();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!newTeacher.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!newTeacher.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newTeacher.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addTeacher = async () => {
    if (validateForm()) {
      const isDuplicate = teachers.some(
        (teacher) => teacher.email === newTeacher.email
      );

      if (isDuplicate) {
        setErrors((prev) => ({
          ...prev,
          email: "A teacher with this email already exists",
        }));
        return;
      }

      const teacherToAdd = {
        ...newTeacher,
        charges: parseFloat(newTeacher.charges) || 0,
      };

      setLoading(true);
      setErrorMessage("");
      try {
        const response = await addNewTeacher(teacherToAdd).unwrap();
        setNewTeacher({
          id: null,
          name: "",
          email: "",
          course: "",
          charges: "",
        });
        fetchData();
        setErrors({});
        setIsAddingTeacher(false);
      } catch (error) {
        setErrorMessage("Failed to add teacher. Please try again.");
        console.error("Error adding teacher:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const removeTeacher = (id: number) => {
    setSelectedTeacher(teachers.find((teacher) => teacher.id === id) || null);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async (id: number) => {
    if (id) {
      try {
        const response = await deleteTeacher(id).unwrap();
          setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      }
    }

    setIsDeleteConfirmOpen(false);
    setSelectedTeacher(null);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Teachers</h2>
        <button
          onClick={() => setIsAddingTeacher(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          + Add Teacher
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : errorMessage ? (
        <p className="text-red-500 text-center">{errorMessage}</p>
      ) : teachers.length === 0 ? (
        <p className="text-gray-500 text-center">No teachers added yet</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="flex justify-between items-center py-4"
            >
              <div>
                <p className="font-medium text-gray-800">{teacher.name}</p>
                <p className="text-gray-600 text-sm">{teacher.email}</p>
                <p className="text-gray-600 text-sm">
                  {teacher.course && ` ${teacher.course}`}
                </p>
                <p className="text-gray-600 text-sm">
                  Charges: {teacher.charges}
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleEditClick(teacher)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-300 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeTeacher(teacher.id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
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
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Add New Teacher
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Teacher Name"
                  value={newTeacher.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Teacher Email"
                  value={newTeacher.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Course</label>
                <select
                  name="course"
                  value={newTeacher.course}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a Course</option>
                  {availableCourses.map((course) => (
                    <option key={course._id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Charges</label>
                <input
                  type="text"
                  name="charges"
                  placeholder="Teacher Charges"
                  value={newTeacher.charges}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsAddingTeacher(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={addTeacher}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Save Teacher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => confirmDelete(selectedTeacher?.id || 0)}
        studentName={selectedTeacher?.name || null}
      />

      {selectedTeacher && (
        <UpdateTeacher
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTeacher(null);
          }}
          teacher={selectedTeacher}
          fetchTeachers={fetchData}
        />
      )}
    </div>
  );
};

export default TeacherManagement;
