import React, { useState, useEffect } from 'react';
import LoginPage from "./Components/pages/Login/Login";
import SignUpPage from "./Components/pages/SignUp/Signup";
import ForgotPasswordPage from "./Components/pages/Fogotpassword/Forgotpassword";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/sidebar/Sidebar";
import HomePage from './Components/sidebar/Home';
import StudentDashboard from './Components/sidebar/StudentDashboard';
import CoursesManagement from './Components/sidebar/CourseManagement';
import TeacherManagement from './Components/sidebar/Teachers';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"login" | "signup" | "dashboard" | "forgotPassword">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Load user data from localStorage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      setCurrentPage("dashboard");
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5005/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const userData = await response.json();
      setIsLoggedIn(true);
      setCurrentUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData)); // Store user data
      setCurrentPage("dashboard");
    } catch (error) {
      console.error(error); // Handle error appropriately
    }
  };

  const handleSignUp = (firstName: string, lastName: string, email: string, password: string) => {
    const newUser = { firstName, lastName, email, password };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setIsLoggedIn(true);
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser)); // Store user data
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser'); // Clear user data from localStorage
    setCurrentPage("login");
  };

  const switchToSignUp = () => setCurrentPage("signup");
  const switchToLogin = () => setCurrentPage("login");
  const switchToForgotPassword = () => setCurrentPage("forgotPassword");

  const switchToDashboard = () => setCurrentPage("dashboard");

  if (isLoggedIn && currentUser) {
    return (
      <Router>
        <div className="flex h-screen">
          <Sidebar user={currentUser} onLogout={handleLogout} />
          <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/teachers" element={<TeacherManagement />} />
              <Route path="/students" element={<StudentDashboard />} />
              <Route path="/courses" element={<CoursesManagement />} />
            </Routes>
          </main>
        </div>
      </Router>
    );
  }

  return (
    <div>
      {currentPage === "login" ? (
        <LoginPage 
          onLogin={handleLogin} 
          onSwitchToSignUp={switchToSignUp} 
          onSwitchToForgotPassword={switchToForgotPassword} 
        />
      ) : currentPage === "signup" ? (
        <SignUpPage 
          onSignUp={handleSignUp} 
          onSwitchToLogin={switchToLogin} 
        />
      ) : currentPage === "forgotPassword" ? (
        <ForgotPasswordPage 
          onSwitchToLogin={switchToLogin} 
        />
      ) : null}
    </div>
  );
};

export default App;
