import React from 'react';
import { DeleteConfirmationModalProps } from '../../utils/interfaces';
import {text as Texts,messageText,buttonText} from '../../utils/constants'

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({  onClose, onConfirm, studentName }) => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h3 className="text-lg font-semibold">{Texts.confirmDelete}</h3>
        <p>{messageText.confirmationDelete} {studentName}?</p>
        <div className="flex space-x-4 mt-4">
          <button onClick={onClose} className="w-full bg-gray-300 text-gray-700 py-2 rounded">{buttonText.cancel}</button>
          <button onClick={onConfirm} className="w-full bg-red-500 text-white py-2 rounded">{buttonText.delete}</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
