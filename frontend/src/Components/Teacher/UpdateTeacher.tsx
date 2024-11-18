import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'
import { useLazyGetAllCoursesQuery,useUpdateTeacherMutation } from '../../redux/api/EmptySplit';
import { Teacher,TeacherCourse,UpdateTeacherProps } from '../../utils/interfaces';
import {text as Texts,buttonText} from '../../utils/constants';

const UpdateTeacher: React.FC<UpdateTeacherProps> = ({
  isOpen,
  onClose,
  teacher,
  fetchTeachers,
}) => {
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableCourses, setAvailableCourses] = useState<TeacherCourse[]>([]);
  const [selectedCourseName, setSelectedCourseName] = useState<string>('');
  const [getAllCoursesApi,{isLoading,isError}]=useLazyGetAllCoursesQuery()
  const [updateTeacherApi] = useUpdateTeacherMutation();

  useEffect(() => {
    if (isOpen && teacher) {
      setEditTeacher(teacher);
      setSelectedCourseName(teacher.course || '');
      fetchAvailableCourses();
    }
  }, [isOpen, teacher]);

  const fetchAvailableCourses = async ():Promise<void> => {
    try{
      const response = await getAllCoursesApi();
      if (response.data) {
        const coursesData: TeacherCourse[] = response.data.courses.map(course => ({ id: course._id, name: course.name }));
        setAvailableCourses(coursesData);
      }
    } catch (error) {
          toast.error('Failed to load available courses');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editTeacher) return;
    const { name, value } = e.target;
    setEditTeacher(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async ():Promise<void> => {
    if (!editTeacher) return;

    const { name, email, charges } = editTeacher;
    if (!name || !email || !selectedCourseName) {
      toast('Please fill in all required fields.');
      return;
    }

    const teacherToUpdate = {
      id: editTeacher.id,
      name,
      email,
      course: selectedCourseName,
      charges: parseFloat(charges as string) || 0,
    };

    try {
      setLoading(true);
      const response = await updateTeacherApi(teacherToUpdate)
      if(response.data?.message){
        toast.success('Teacher details updated successfully!');
      }
      fetchTeachers();
      onClose();
    } catch (error) {
      toast.error('Failed to update teacher. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !editTeacher) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{Texts.editTeacher}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{Texts.name}</label>
            <input
              name="name"
              type="text"
              value={editTeacher.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{Texts.email}</label>
            <input
              name="email"
              type="email"
              value={editTeacher.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{Texts.courses}</label>
            <select
              name="course"
              value={selectedCourseName}
              onChange={(e) => setSelectedCourseName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{Texts.selectedCourse}</option>
              {availableCourses.map(course => (
                <option key={course.id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{Texts.charges}</label>
            <input
              name="charges"
              type="text"
              value={editTeacher.charges}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              {buttonText.cancel}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTeacher;