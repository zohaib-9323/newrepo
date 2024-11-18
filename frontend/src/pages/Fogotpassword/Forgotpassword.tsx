import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForgetpasswordMutation, useResetpasswordMutation } from '../../redux/api/EmptySplit';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {emailValidationSchema,passwordValidationSchema} from '../../utils/ValidationSchemas';
import {text as Texts, buttonText} from '../../utils/constants'
const ForgotPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'email' | 'resetPassword'>('email');
  const [message, setMessage] = useState('');
  const [forgotPassword] = useForgetpasswordMutation();
  const [resetPassword] = useResetpasswordMutation();
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleEmailSubmit = async (values: { email: string }, { setSubmitting, setErrors }: any):Promise<void> => {
    try {
      await forgotPassword(values.email)
      setEmail(values.email);
      setStep('resetPassword');
      setMessage('Email verified. Please enter your new password.');
    } catch (error) {
      setErrors({ email: 'Email not found in our database' });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordReset = async (
    values: { newPassword: string; confirmPassword: string },
    { setSubmitting, setErrors }: any
  ):Promise<void> => {
    try {
      await resetPassword({ email: email, newPassword: values.newPassword })
      setMessage('Password successfully reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setErrors({ newPassword: 'Failed to reset password. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === 'email' ? 'Forgot Password' : 'Reset Password'}
        </h2>

        {step === 'email' ? (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={emailValidationSchema}
            onSubmit={handleEmailSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {Texts.email}
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
                {message && <p className="text-green-500 text-sm">{message}</p>}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {buttonText.verifyEmail}
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {buttonText.backToLogin}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{ newPassword: '', confirmPassword: '' }}
            validationSchema={passwordValidationSchema}
            onSubmit={handlePasswordReset}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    {Texts.newPassword}
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
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
                  <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    {Texts.confirmPassword}
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                </div>
                {message && <p className="text-green-500 text-sm">{message}</p>}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {buttonText.resetPassord}
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {buttonText.backToLogin}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
