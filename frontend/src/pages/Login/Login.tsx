import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useLoginMutation } from "../../redux/api/EmptySplit";
import {loginValidationSchema} from '../../utils/ValidationSchemas';
import {text as Texts,buttonText,messageText} from "../../utils/constants";
const LoginPage: React.FC = ({}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const [loginapi] = useLoginMutation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting, setFieldError }: any
  ):Promise<void> => {
    try {
      const result = await loginapi(values)
      const userData = { email: values.email, password: values.password };
      localStorage.setItem("currentUser", JSON.stringify(userData));
      if(result.data?.success) {
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
      }
    } catch (error) {
      setFieldError("password", "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{Texts.login}</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {Texts.email}
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  {Texts.password}
                </label>
                <div className="mt-1 relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>
              </div>
              <div className="mt-4 flex flex-col space-y-2 text-center">
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  {buttonText.forgotPassword}
                </button>
                <div>
                  <span className="text-sm text-gray-600">
                    {messageText.dontHaveAcc}{" "}
                  </span>
                  <button
                    onClick={() => navigate("/signup")}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    {buttonText.signup}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
