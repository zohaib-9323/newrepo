import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignupMutation } from '../../../Services/auth';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signup, { isLoading }] = useSignupMutation();
  const [serverError, setServerError] = useState(''); 
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        'Password must contain one uppercase letter, one number, and one special character'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleSubmit = async (values: { firstName: string; lastName: string; email: string; password: string; confirmPassword: string; }, { setSubmitting }: any) => {
    setServerError(''); 
    try {
      const result = await signup({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password
              }).unwrap();
      if(result.success) {
        const newUser = { firstName: values.firstName, lastName: values.lastName, email: values.email, password: values.password };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem("currentUser", JSON.stringify({ email: values.email, password: values.password }));
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
      }
    } catch (error) {
      setServerError('Failed to sign up. Please try again.'); 
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form className="space-y-4">
              {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
              {/* Form Fields */}
              <div className="flex space-x-4">
                {/* First Name and Last Name */}
                <div className="flex-1">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <Field
                    type="text"
                    name="firstName"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex-1">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Field
                    type="text"
                    name="lastName"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>
              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <Field
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
              </div>
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isSubmitting || isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Already have an account? </span>
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

