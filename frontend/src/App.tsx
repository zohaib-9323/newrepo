import React, { useState, useEffect } from "react";
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









