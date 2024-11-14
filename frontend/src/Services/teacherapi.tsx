import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Teacher {
    id: number | null;
    name: string;
    email: string;
    course: string;
    charges: string;
  }

  interface TeachersResponse {
    message: string;
    teachers: Teacher[];
  }

export const teacherapiSlice = createApi({
  reducerPath: 'teacherapi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_PUBLIC_URL,
  }),
  endpoints: (builder) => ({
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

export const {useAddTeacherMutation,useDeleteTeacherMutation,useGetAllTeachersQuery,useLazyGetAllTeachersQuery,useUpdateTeacherMutation } = teacherapiSlice;
