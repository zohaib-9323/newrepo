import React from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentName: string | null;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, studentName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h3 className="text-lg font-semibold">Confirm Deletion</h3>
        <p>Are you sure you want to delete {studentName}?</p>
        <div className="flex space-x-4 mt-4">
          <button onClick={onClose} className="w-full bg-gray-300 text-gray-700 py-2 rounded">Cancel</button>
          <button onClick={onConfirm} className="w-full bg-red-500 text-white py-2 rounded">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
