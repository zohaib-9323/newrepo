import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import PublicRoutes from "./Routes/PublicRoutes";
import PrivateRoutes from "./Routes/PrivateRoutes";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("currentUser");
      setIsLoggedIn(!!storedUser);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  return (
    <>
      {isLoggedIn ? <PrivateRoutes /> : <PublicRoutes />}
    </>
  );
};

export default App;









// import React, { useState, useEffect } from "react";
// import LoginPage from "./Components/pages/Login/Login";
// import SignUpPage from "./Components/pages/SignUp/Signup";
// import ForgotPasswordPage from "./Components/pages/Fogotpassword/Forgotpassword";
// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import PublicRoutes from "./Routes/PublicRoutes";
// import PrivateRoutes from "./Routes/PrivateRoutes";
// import Sidebar from "./Components/sidebar/Sidebar";
// import HomePage from "./Components/sidebar/Home";
// import StudentDashboard from "./Components/sidebar/StudentDashboard";
// import CoursesManagement from "./Components/sidebar/CourseManagement";
// import TeacherManagement from "./Components/sidebar/Teachers";

// interface User {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

// const App: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [users, setUsers] = useState<User[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("currentUser");
//     if (storedUser) {;
//       setIsLoggedIn(true);
//     }
//     else{
//       setIsLoggedIn(false);
//     }
//   }, []);

//   // const handleLogin = (email: string, password: string) => {
//   //     const userData =({ email, password });
//   //     setIsLoggedIn(true);
//   //     localStorage.setItem("currentUser", JSON.stringify(userData));
//   // };

//   // const handleSignUp = (
//   //   firstName: string,
//   //   lastName: string,
//   //   email: string,
//   //   password: string
//   // ) => {
//   //   const newUser = { firstName, lastName, email, password };
//   //   const updatedUsers = [...users, newUser];
//   //   setUsers(updatedUsers);
//   //   setIsLoggedIn(true);
//   //   localStorage.setItem("currentUser", JSON.stringify(newUser));
//   // };

//   // const handleLogout = () => {
//   //   setIsLoggedIn(false);
//   //   localStorage.removeItem("currentUser");
//   // };

//   // if (isLoggedIn) {
//   //   return (
//   //       <div className="flex h-screen">
//   //         <Sidebar onLogout={handleLogout} />
//   //         <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
//   //           <Routes>
//   //             <Route path="/home" element={<HomePage />} />
//   //             <Route path="*" element={<HomePage />} />
//   //             <Route path="/teachers" element={<TeacherManagement />} />
//   //             <Route path="/students" element={<StudentDashboard />} />
//   //             <Route path="/courses" element={<CoursesManagement />} />
//   //           </Routes>
//   //         </main>
//   //       </div>
//   //   );
//   // }

//   // return (
//   //   <div>
//   //     <Routes>
//   //       <Route
//   //         path="/login"
//   //         element={<LoginPage onLogin={handleLogin} />}
//   //       />
//   //       <Route
//   //         path="/signup"
//   //         element={<SignUpPage onSignUp={handleSignUp} />}
//   //       />
//   //       <Route
//   //         path="/forgot-password"
//   //         element={<ForgotPasswordPage  />}
//   //       />
//   //       <Route path="*" element={<Navigate to="/login" />} />
//   //     </Routes>
//   //   </div>
//   // );
//   return(
//     <>
//     {isLoggedIn ? <PrivateRoutes /> : <PublicRoutes />}
//   </>

//   )
// };

// export default App;
