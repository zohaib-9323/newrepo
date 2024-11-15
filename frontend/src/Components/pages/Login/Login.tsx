import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../../Services/auth";

const LoginPage: React.FC = ({}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const [loginapi, { isLoading, isError }] = useLoginMutation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Please fill in your email"),
    password: Yup.string().required("Please fill in your password"),
  });

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting, setFieldError }: any
  ) => {
    try {
      const result = await loginapi(values).unwrap();
      console.log("Results", result.success);
      const userData = { email: values.email, password: values.password };
      localStorage.setItem("currentUser", JSON.stringify(userData));
      if(result.success) {
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
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
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
                  Password
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
                  Forgot Password?
                </button>
                <div>
                  <span className="text-sm text-gray-600">
                    Don't have an account?{" "}
                  </span>
                  <button
                    onClick={() => navigate("/signup")}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Sign up
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
