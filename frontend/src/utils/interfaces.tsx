export interface Course {
    _id: string;
    name: string;
    price: number;
    institute: string;
  }
  
export  interface FormData {
    _id: string;
    name: string;
    price: string;
    institute: string;
  }
  
export  interface CoursesResponse {
    message: string;
    courses: Course[];
  }
export  interface Teacher {
    id: number | null;
    name: string;
    email: string;
    course: string;
    charges: string;
  }
export interface StudentCourse {
    id: string;
    name: string;
  }
export interface TeachersResponse {
    message: string;
    teachers: Teacher[];
  }
  
export  interface Student {
    id: string;
    Name: string;
    Department: string;
    grade: string;
    status: "Active" | "Inactive";
    courses: StudentCourse[];
  }
export  interface StudentsResponse {
    message: string;
    students: Student[];
  }
export  interface TeacherCourse {
    id: string;
    name: string;
  }
export  interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
export interface DeleteConfirmationModalProps {
    // isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    studentName: string | null;
  }
export interface Stats {
    teachers: Teacher[];
    students: Student[];
    courses: Course[];
  }
export interface SidebarProps {
    onLogout: () => void;
  }
export interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    fetchStudents: () => void;
  }
export interface EditStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: Student | null;
    fetchStudents: () => void;
  }
  export interface AddTeacherProps {
    availableCourses: Course[];
    fetchTeachers: () => Promise<void>; 
    onClose: () => void;
    teachers: Teacher[];
  }

  export interface UpdateTeacherProps {
    isOpen: boolean;
    onClose: () => void;
    teacher: Teacher | null;
    fetchTeachers: () => void;
  }