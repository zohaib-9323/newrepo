import React, { useState } from 'react';
import { 
  Users, UserPlus, GraduationCap, 
  UserCheck, ArrowUpRight, Search,
  ArrowDown, ArrowUp, Home, BookOpen, Menu 
} from 'lucide-react';
import StudentDashboard from './StudentDashboard';
import CoursesManagement from './CourseManagement'; // Import the CoursesManagement component

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface DashboardProps {
  user?: User;  // Made user optional
  onLogout?: () => void;  // Made onLogout optional
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user = { firstName: 'Guest', lastName: '', email: '' },  // Added default value
  onLogout = () => {}  // Added default value
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('students');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'courses', label: 'Courses', icon: BookOpen },
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'students':
        return <StudentDashboard />;
      case 'courses':
        return <CoursesManagement />;
      default:
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">{navItems.find(item => item.id === activePage)?.label}</h2>
            <p className="text-gray-600">Content for {navItems.find(item => item.id === activePage)?.label} page goes here.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`bg-white w-64 min-h-screen flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-10`}>
        <div className="p-4 border-b">
          <h2 className="text-2xl font-semibold">School Dashboard</h2>
        </div>
        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 mt-2 text-sm font-semibold text-left rounded-lg ${activePage === item.id ? 'bg-gray-200 text-gray-900' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
            >
              <item.icon className="w-5 h-5 mr-2" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="mr-4 md:hidden">
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{navItems.find(item => item.id === activePage)?.label}</h1>
            </div>
            <div>
              <span className="mr-4">{user.firstName}</span>
              <button
                onClick={onLogout}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="flex-grow p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
