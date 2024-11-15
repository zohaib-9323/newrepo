import React, { useState, useEffect } from "react";
import LoginPage from "../Components/pages/Login/Login";
import SignUpPage from "../Components/pages/SignUp/Signup";
import ForgotPasswordPage from "../Components/pages/Fogotpassword/Forgotpassword";
import { Routes, Route, Navigate,useNavigate } from 'react-router-dom';

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
