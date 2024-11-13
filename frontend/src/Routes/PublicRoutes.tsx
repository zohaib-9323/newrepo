import React, { useState, useEffect } from "react";
import LoginPage from "../Components/pages/Login/Login";
import SignUpPage from "../Components/pages/SignUp/Signup";
import ForgotPasswordPage from "../Components/pages/Fogotpassword/Forgotpassword";
import { Routes, Route, Navigate,useNavigate } from 'react-router-dom';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
const PublicRoutes: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  // const handleLogin = (email: string, password: string) => {
  //   const userData = { email, password };
  //   localStorage.setItem("currentUser", JSON.stringify(userData));
  //   window.dispatchEvent(new Event('authChange'));
  //   navigate('/');
  // };

  const handleSignUp = (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    const newUser = { firstName, lastName, email, password };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("currentUser", JSON.stringify({ email, password }));
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage  />}
        />
        <Route
          path="/signup"
          element={<SignUpPage onSignUp={handleSignUp} />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};
export default PublicRoutes;
