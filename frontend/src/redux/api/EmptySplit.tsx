import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { CoursesResponse,TeachersResponse,StudentsResponse } from '../../utils/interfaces';

const BASE_URL = process.env.REACT_APP_PUBLIC_URL;

export const authapiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials)=>({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
        }),
        signup: builder.mutation({
            query: (signupData)=>({
                url: 'auth/signup',
                method: 'POST',
                body: signupData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
        }),
        forgetpassword: builder.mutation({
            query: (email)=>({
                url: 'auth/forgotpassword',
                method: 'POST',
                body: { email },
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
        }),
        resetpassword: builder.mutation({
            query: ({ email, newPassword }: { email: string; newPassword: string }) => ({
              url: 'auth/reset-password',
              method: 'POST',
              body: { email, newPassword },
              headers: {
                'Content-Type': 'application/json',
              },
            }),
          }),
          getAllCourses: builder.query<CoursesResponse, void>({
            query: () => 'course/getcourse',
          }),
          addCourse: builder.mutation({
            query: (course) => ({
              url: 'course/addcourse',
              method: 'POST',
              body: course,
            }),
          }),
          updateCourse: builder.mutation({
            query: (course) => ({
              url: `course/updatecourse/${course._id}`,
              method: 'PUT',
              body: course,
            }),
          }),
          deleteCourse: builder.mutation({
            query: (id) => ({
              url: `course/deletecourse/${id}`,
              method: 'DELETE',
            }),
          }),
          getAllStudents: builder.query<StudentsResponse, void>({
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
            getAllTeachers: builder.query<TeachersResponse,void>({
                query: () => 'teacher/getteachers',
              }),
              addTeacher: builder.mutation({
                  query: (teacher) => ({
                    url: 'teacher/createteachers',
                    method: 'POST',
                    body: teacher,
                  }),
                }),
                UpdateTeacher: builder.mutation({
                  query: (teacher) => ({
                    url: `teacher/updateteachers/${teacher.id}`,
                    method: 'PUT',
                    body: teacher,
                  }),
                }),
                deleteTeacher: builder.mutation({
                  query: (id) => ({
                    url: `teacher/delteachers/${id}`,
                    method: 'DELETE',
                  }),
                }),

    }),
});

export const { useLoginMutation, 
    useSignupMutation, 
    useForgetpasswordMutation , 
    useResetpasswordMutation,
    useGetAllCoursesQuery,
    useAddCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    useLazyGetAllCoursesQuery,
    useLazyGetAllStudentsQuery,
    useGetAllStudentsQuery,
    useAddStudentMutation,
    useDeleteStudentMutation,
    useUpdateStudentMutation,
    useAddTeacherMutation,
    useDeleteTeacherMutation,
    useGetAllTeachersQuery,
    useLazyGetAllTeachersQuery,
    useUpdateTeacherMutation
 }=authapiSlice;