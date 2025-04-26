"use client";
import React, { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  notes?: string;
  setNotes: (notes: string) => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  onConfirm,
  onCancel,
  loading,
  notes = "",
  setNotes,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && !loading) {
        onCancel();
      }
    };
    
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [visible, onCancel, loading]);

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onCancel();
      }
    };
    
    if (visible) {
      window.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [visible, onCancel, loading]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 transition-opacity duration-300">
      <div 
        ref={modalRef}
        className="bg-gray-900 rounded-lg shadow-xl max-w-md mx-4 w-full border border-gray-800 transform transition-all duration-300"
        style={{
          animation: "modalFade 0.3s ease-out",
        }}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-3 mb-4">
            تأكيد الحجز
          </h2>
          
          <p className="my-4 text-center text-gray-300">
            هل أنت متأكد من رغبتك في إرسال طلب الحجز هذا؟
          </p>
          
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
              ملاحظات (اختياري)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="يمكنك كتابة ملاحظات أو استفسارات خاصة بالحجز..."
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors duration-200"
              rows={4}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  جاري الإرسال...
                </>
              ) : (
                'تأكيد الحجز'
              )}
            </button>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes modalFade {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ConfirmDialog;
