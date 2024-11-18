import React from "react";
import LoginPage from "../pages/Login/Login";
import SignUpPage from "../pages/SignUp/Signup";
import ForgotPasswordPage from "../pages/Fogotpassword/Forgotpassword";
import { Routes, Route, Navigate } from 'react-router-dom';

const PublicRoutes: React.FC = () => {

  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage  />}
        />
        <Route
          path="/signup"
          element={<SignUpPage />}
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
