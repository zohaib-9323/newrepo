import React, { useState, useEffect } from "react";
import DeleteConfirmationModal from "../DeleteConfirmation/DeleteConfirmmationModal";
import UpdateTeacher from "../Teacher/UpdateTeacher";
import {
  useLazyGetAllTeachersQuery,
  useAddTeacherMutation,
  useDeleteTeacherMutation,
  useLazyGetAllCoursesQuery
} from "../../redux/api/EmptySplit";
import AddTeacher from "../Teacher/AddTeachers";
import { Teacher,Course } from "../../utils/interfaces";
import {text as Texts, buttonText} from "../../utils/constants"


const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [getAllCoursesApi] = useLazyGetAllCoursesQuery();
  const [getAllTeachers] = useLazyGetAllTeachersQuery();
  const [deleteTeacher] = useDeleteTeacherMutation();


  const fetchData = async ():Promise<void> => {
    try {
      const response = await getAllTeachers();
      if (response.data) {
        const transformedTeachers = response.data.teachers.map((teacher: Teacher) => ({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          course: teacher.course || "",
          charges: teacher.charges || "",
        }));
        setTeachers(transformedTeachers);
      }
    } catch (error) {
    }
  };

  const fetchAvailableCourses = async ():Promise<void> => {
    try {
      const response = await getAllCoursesApi();
      if (response.data) {
        setAvailableCourses(response.data.courses || []);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchData();
    fetchAvailableCourses();
  }, []);
  

  const removeTeacher = (id: number) => {
    setSelectedTeacher(teachers.find((teacher) => teacher.id === id) || null);
    setIsDeleteConfirmOpen(true);
  };
  const confirmDelete = async (id: number) => {
    try {
      await deleteTeacher(id)
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
    } catch (error) {
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
        <h2 className="text-2xl font-bold text-gray-800">{Texts.teacher}</h2>
        <button
          onClick={() => setIsAddingTeacher(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          {Texts.addTeacher}
        </button>
      </div>

      {teachers.length === 0 ? (
        <p className="text-gray-500 text-center">{Texts.noTeacher}</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="flex justify-between items-center py-4">
              <div>
                <p className="font-medium text-gray-800">{teacher.name}</p>
                <p className="text-gray-600">{teacher.email}</p>
                <p className="text-gray-600">{teacher.course}</p>
                <p className="text-gray-600">{Texts.charges}: {teacher.charges}</p>
              </div>
              <div>
                <button
                  onClick={() => handleEditClick(teacher)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 mr-2">
                  {buttonText.edit}
                </button>
                <button
                  onClick={() => removeTeacher(teacher.id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  {buttonText.remove}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAddingTeacher && ( 
         <AddTeacher
          availableCourses={availableCourses}
          fetchTeachers={fetchData}
          onClose={() => setIsAddingTeacher(false)}
          teachers={teachers}
        />
      )}
      {isDeleteConfirmOpen && 
      <DeleteConfirmationModal
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => confirmDelete(selectedTeacher?.id || 0)}
        studentName={selectedTeacher?.name || ""}
      />}
      
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
