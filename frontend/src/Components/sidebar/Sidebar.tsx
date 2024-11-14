import React, { useState } from "react";
import {
  Home,
  User,
  Menu,
  X,
  GraduationCap,
  BookOpen,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
 
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarLinks = [
    {
      path: "/",
      icon: <Home className="w-5 h-5" />,
      label: "Home",
    },
    {
      path: "/teachers",
      icon: <User className="w-5 h-5" />,
      label: "Teachers",
    },
    {
      path: "/students",
      icon: <GraduationCap className="w-5 h-5" />,
      label: "Students",
    },
    {
      path: "/courses",
      icon: <BookOpen className="w-5 h-5" />,
      label: "Courses",
    },
  ];

  return (
    <div className="flex h-screen">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {isOpen ? <X /> : <Menu />}
      </button>
      <div
        className={`fixed md:relative z-40 w-64 h-full bg-gray-800 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          My App
        </div>

        <nav className="mt-10">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors duration-200"
            >
              {link.icon}
              <span className="ml-3">{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-b border-gray-700">
          {/* <span className="text-gray-300">{user.firstName}</span> */}
          <button
            onClick={onLogout}
            className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
          >
            <LogOut className="w-5 h-5 mr-2" /> <span>Logout</span>
          </button>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
