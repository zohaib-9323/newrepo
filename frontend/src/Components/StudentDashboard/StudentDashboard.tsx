import React, { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  Trash2,
  Edit2,
} from "lucide-react";
import AddStudentModal from "../Student/AddStudent/AddStudent";
import EditStudentModal from "../Student/EditStudent/EditStudentModal";
import DeleteConfirmationModal from "../DeleteConfirmation/DeleteConfirmmationModal";
import { useLazyGetAllStudentsQuery, useDeleteStudentMutation } from "../../redux/api/EmptySplit";
import { Student, StudentsResponse } from "../../utils/interfaces";
import { toast } from "react-toastify";
import {text as Texts,messageText} from "../../utils/constants";

const StudentDashboard: React.FC = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [getAllStudentApi] = useLazyGetAllStudentsQuery();
  const [deleteStudent] = useDeleteStudentMutation();

  const fetchStudents = async (): Promise<void> => {
    try {
      const response = await getAllStudentApi();
      if (response.data) {
        const studentData: StudentsResponse = response.data;
        const transformedData = studentData.students.map((student: any) => ({
          id: student._id,
          Name: student.Name,
          Department: student.Department,
          grade: student.grade,
          status: student.status || "Active",
          courses: student.courses.map((course: string, index: string) => ({
            id: index,
            name: course,
          })),
        }));
        setStudents(transformedData);
      }
    } catch (error) {} 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleRemoveStudent = (id: string) => {
    setSelectedStudent(students.find((student) => student.id === id) || null);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async (id: string): Promise<void> => {
    if (id) {
      try {
        const response = await deleteStudent(id)
        setStudents((prev) => prev.filter((student) => student.id !== id));
        if(response.data?.success) {
          toast.success("Student deleted successfully.");
        } else {
          toast.error(" Failed to delete student.");
        }

      } catch (error) {}
    }
    setIsDeleteConfirmOpen(false);
    setSelectedStudent(null);
  };

  if (loading) return <div>{Texts.Loading}</div>;
  if (error) return <div>{Texts.error} {error}</div>;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <button
          onClick={() => setIsAddStudentModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          {Texts.addNewStudent}
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  {Texts.name}
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  {Texts.grade}
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  {Texts.department}
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  {Texts.courses}
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  {Texts.status}
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  {Texts.Actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students
                .filter(
                  (student) =>
                    student.Name.toLowerCase().includes(
                      searchTerm.toLowerCase()
                    ) ||
                    student.Department.toLowerCase().includes(
                      searchTerm.toLowerCase()
                    )
                )
                .map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {student.Name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {student.grade}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {student.Department}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {student.courses && student.courses.length > 0 ? (
                        student.courses.map((course) => course.name).join(", ")
                      ) : (
                        <span className="text-gray-500">
                           {messageText.noCourses}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          student.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditClick(student)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRemoveStudent(student.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        fetchStudents={fetchStudents}
      />
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        fetchStudents={fetchStudents}
      />
      {isDeleteConfirmOpen &&
      <DeleteConfirmationModal
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => confirmDelete(selectedStudent?.id ?? "")}
        studentName={selectedStudent?.Name ?? null}
      />}
      
    </>
  );
};

export default StudentDashboard;
