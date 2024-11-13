import { formatProdErrorMessage } from '@reduxjs/toolkit';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const BASE_URL = process.env.REACT_APP_PUBLIC_URL;

export const authapiSlice = createApi({
    reducerPath: 'authapi',
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
          

    }),
});

export const { useLoginMutation, useSignupMutation, useForgetpasswordMutation , useResetpasswordMutation }=authapiSlice;