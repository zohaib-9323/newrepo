import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Course {
  _id: string;
  name: string;
  price: number;
  institute: string;
}

interface CoursesResponse {
  message: string;  
  courses: Course[]; 
}

export const courseapiSlice = createApi({
  reducerPath: 'courseapi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_PUBLIC_URL,  
  }),
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetAllCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseapiSlice;
