import React, { useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowUp,
  Search,
  UserPlus,
  Trash2,
  Edit2,
} from "lucide-react";
import AddStudentModal from "./Student/AddStudent";
import EditStudentModal from "./Student/EditStudentModal";
import DeleteConfirmationModal from "./Student/DeleteConfirmmationModal";

interface Course {
  id: string;
  name: string;
}

interface Student {
  id: string;
  Name: string;
  Department: string;
  grade: string;
  status: "Active" | "Inactive";
  courses: Course[];
}

const StudentDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Student>("Name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_PUBLIC_URL}student/getstudent`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const transformedData = data.students.map((student: any) => ({
        id: student._id,
        Name: student.Name,
        Department: student.Department,
        grade: student.grade,
        status: student.status || "Active",
        courses: student.courses.map((course: string, index: number) => ({
          id: index,
          name: course,
        })),
      }));

      setStudents(transformedData);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSort = (field: keyof Student) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };
  const handleRemoveStudent = (id: string) => {
    setSelectedStudent(students.find((student) => student.id === id) || null);
    setIsDeleteConfirmOpen(true);
  };
  const confirmDelete = async (id: string) => {
    if (id) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_PUBLIC_URL}student/deletestudent/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setStudents((prev) => prev.filter((student) => student.id !== id));
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to delete student.");
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      }
    }

    setIsDeleteConfirmOpen(false);
    setSelectedStudent(null);
  };

  const sortedStudents = [...students].sort((a, b) => {
    const modifier = sortDirection === "asc" ? 1 : -1;
    if (a[sortField] < b[sortField]) return -1 * modifier;
    if (a[sortField] > b[sortField]) return 1 * modifier;
    return 0;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
          Add New Student
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => handleSort("Name")}
                >
                  <div className="flex items-center gap-2">
                    Name
                    {sortField === "Name" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedStudents
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
                          No courses assigned
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
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => confirmDelete(selectedStudent?.id || "")}
        studentName={selectedStudent?.Name || null}
      />
    </>
  );
};

export default StudentDashboard;
