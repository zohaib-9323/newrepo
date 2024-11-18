import React, { useState, useEffect } from "react";
import { Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLazyGetAllCoursesQuery,useLazyGetAllStudentsQuery,useLazyGetAllTeachersQuery } from "../../redux/api/EmptySplit";
import { Stats,Student,StudentCourse,Course,Teacher } from "../../utils/interfaces";
import {text as Texts} from "../../utils/constants"


const HomePage: React.FC = ():JSX.Element => {
  const [stats, setStats] = useState<Stats>({
    teachers: [],
    students: [],
    courses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [getCourseApi]=useLazyGetAllCoursesQuery();
  const [getStudentApi]=useLazyGetAllStudentsQuery();
  const [getTeacherApi]=useLazyGetAllTeachersQuery();
 
  useEffect(() => {
    const fetchAllData = async ():Promise<void> => {
      setLoading(true);
      try {
        const [teachersRes, studentsRes, coursesRes] = await Promise.all([
          getTeacherApi(),
          getStudentApi(),
          getCourseApi(),
        ]);

        const teachersData = teachersRes.data;
        const studentsData = studentsRes.data;
        const coursesData = coursesRes.data;

        setStats({
          teachers: teachersData?.teachers || [],
          students: studentsData?.students || [],
          courses: coursesData?.courses || [],
        });
      } catch (err) {
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [getCourseApi, getStudentApi, getTeacherApi]);

  const getActiveStudents = ():number => {
    return stats.students.filter((student: Student) => student.status === "Active")
      .length;
  };

  const getCoursesData = (): { name: string; students: number }[] => {
    return stats.courses.map((course: Course) => ({
      name: course.name,
      students: stats.students.filter((student: Student) =>
        student.courses?.some((sc: StudentCourse) => sc.name === course.name)
      ).length,
    }));
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">{Texts.loadingDashboard}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {Texts.dashboardOverview}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">
              {Texts.totalTeachers}
            </h3>
            <Users className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats.teachers.length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">
              {Texts.totalStudents}
            </h3>
            <GraduationCap className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats.students.length}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {getActiveStudents()} {Texts.active}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{Texts.totalCourses}</h3>
            <BookOpen className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats.courses.length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">
              {Texts.average}
            </h3>
            <TrendingUp className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats.courses.length
              ? (stats.students.length / stats.courses.length).toFixed(1)
              : "0"}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {Texts.courseEnrollment}
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getCoursesData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {Texts.recentTeachers}
          </h3>
          <div className="space-y-3">
            {stats.teachers.slice(-3).map((teacher: Teacher) => (
              <div
                key={teacher.id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{teacher.name}</p>
                  <p className="text-sm text-gray-600">{teacher.course}</p>
                </div>
                <span className="text-sm text-gray-600">
                  ${teacher.charges}/hr
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {Texts.recentStudents}
          </h3>
          <div className="space-y-3">
            {stats.students.slice(-3).map((student: Student) => (
              <div
                key={student.id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{student.Name}</p>
                  <p className="text-sm text-gray-600">{student.Department}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    student.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {student.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
