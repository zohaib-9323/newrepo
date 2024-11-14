import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

  interface StudentResponse {
    message: string;
    students: Student[];
  }
export const studentapiSlice = createApi({
  reducerPath: 'studentapi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_PUBLIC_URL,
  }),
  endpoints: (builder) => ({
    getAllStudents: builder.query<StudentResponse, void>({
      query: () => 'student/getstudent',
    }),
    addStudent: builder.mutation({
        query: (student) => ({
          url: 'student/creatstudent',
          method: 'POST',
          body: student,
        }),
      }),
      updateStudent: builder.mutation({
        query: (student) => ({
          url: `student/updatestudent/${student.id}`,
          method: 'PUT',
          body: student,
        }),
      }),
      deleteStudent: builder.mutation({
        query: (id) => ({
          url: `student/deletestudent/${id}`,
          method: 'DELETE',
        }),
      }),
  }),
});

export const { useLazyGetAllStudentsQuery,useGetAllStudentsQuery,useAddStudentMutation,useDeleteStudentMutation,useUpdateStudentMutation } = studentapiSlice;
