"use client";

import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import { subscribeToToasts, removeToast } from '@/utils/toast';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: (id: string) => void;
}

const ToastItem = ({ id, message, type, onClose }: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    // Wait for animation to complete
    setTimeout(() => onClose(id), 300);
  };

  const icon = {
    success: <FaCheckCircle className="text-green-500 text-xl" />,
    error: <FaTimesCircle className="text-red-500 text-xl" />,
    warning: <FaExclamationCircle className="text-yellow-500 text-xl" />,
    info: <FaInfoCircle className="text-blue-500 text-xl" />,
  }[type];

  const bgColor = {
    success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
  }[type];

  const textColor = {
    success: 'text-green-800 dark:text-green-200',
    error: 'text-red-800 dark:text-red-200',
    warning: 'text-yellow-800 dark:text-yellow-200',
    info: 'text-blue-800 dark:text-blue-200',
  }[type];
  return (
    <div 
      className={`flex items-center p-4 mb-3 border rounded-lg shadow-md ${bgColor}`}
      role="alert"
    >
      <div className="ml-3">{icon}</div>
      <div className={`flex-1 ${textColor} font-medium`} dir="rtl">{message}</div>
      <button 
        onClick={handleClose}
        className="p-1 ml-auto text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg focus:ring-2 focus:ring-gray-300 inline-flex"
        aria-label="Close"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' | 'warning'; }>>([]);

  useEffect(() => {
    // Subscribe to toast updates
    const unsubscribe = subscribeToToasts((updatedToasts) => {
      setToasts(updatedToasts);
    });

    // Clean up subscription when component unmounts
    return () => unsubscribe();
  }, []);

  const handleClose = (id: string) => {
    removeToast(id);
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-xs">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={handleClose}
        />
      ))}
    </div>
  );
}