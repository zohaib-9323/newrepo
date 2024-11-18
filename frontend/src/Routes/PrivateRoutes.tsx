import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from "../Components/sidebar/Sidebar";
import HomePage from "../Components/Home/Home";
import StudentDashboard from "../Components/StudentDashboard/StudentDashboard";
import CoursesManagement from "../Components/CourseDashboard/CourseManagement";
import TeacherManagement from "../Components/TeacherDashboard/Teachers";
const PrivateRoutes: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teachers" element={<TeacherManagement />} />
          <Route path="/students" element={<StudentDashboard />} />
          <Route path="/courses" element={<CoursesManagement />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};


export default PrivateRoutes;
