import React, { useState, useCallback } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { convertDateToCode } from "@/utils/formatDoctorAvailabilities";
import { Teacher } from "@/types";

// Toast notification component
const Toast: React.FC<{
  message: string;
  type: "success" | "error";
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:top-4 md:w-96 p-4 rounded-lg shadow-lg transform transition-all duration-500 translate-y-0 z-50 flex items-center justify-between ${
        type === "success" ? "bg-emerald-600" : "bg-red-600"
      }`}
      role="alert"
    >
      <p className="text-white font-semibold">{message}</p>
      <button 
        onClick={onClose}
        className="text-white hover:text-gray-200"
        aria-label="Close notification"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Loading button component
const LoadingButton: React.FC<{
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  loadingText: string;
  text: string;
}> = ({ loading, disabled, onClick, loadingText, text }) => (
  <button
    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
    disabled={disabled || loading}
    onClick={onClick}
  >
    {loading ? (
      <div className="flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        {loadingText}
      </div>
    ) : text}
  </button>
);

interface BookingSummaryProps {
  selectedSlot: string | null;
  selectedDuration: number;
  selectedType: string;
  teacher: Teacher;
  selectedDate: {
    date: string;
    slots: { id: number; time: string; type: string }[]; 
  } | null;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedSlot,
  selectedDuration,
  selectedType,
  teacher,
  selectedDate,
}) => {
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const getDateTime = useCallback(() => {
    if (!selectedDate || !selectedSlot) return null;

    // Combine the date and time
    const dateStr = new Date(selectedDate.date).toISOString().split("T")[0];
    const timeStr = selectedSlot;
    const combinedDateTime = `${dateStr}T${timeStr}`;

    return combinedDateTime;
  }, [selectedDate, selectedSlot]);

  const bookAppointment = useCallback(() => {
    if (!selectedSlot || !selectedDate) return;
    
    setLoading(true);
    setTimeout(() => {
      setShowConfirmDialog(true);
      setLoading(false);
    }, 500);
  }, [selectedSlot, selectedDate]);

  const cancelCreate = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  const confirmCreate = useCallback(async () => {
    if (!selectedSlot || !selectedDate) return;

    setLoading(true);
    setErrorMessage(null);
    
    try {
      // Prepare booking data
      const bookingData = {
        teacherId: teacher.id,
        notes: notes,
        duration: selectedDuration,
        appointmentType: "first_time",
        appointmentDate: getDateTime(),
        timeSlot: selectedSlot,
        date: selectedDate.date
      };
      
      console.log("Booking data:", bookingData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowConfirmDialog(false);
      setToastMessage("تم إرسال طلب الحجز بنجاح!");
      setToastType("success");
      setShowToast(true);
      
    } catch (error) {
      setToastMessage(`فشل في إرسال طلب الحجز: ${error}`);
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }, [selectedSlot, selectedDate, notes, teacher.id, selectedDuration, getDateTime]);

  return (
    <div className="flex flex-col gap-4 bg-gray-900 rounded-lg shadow-lg p-6 w-full border border-gray-800">
      {showToast && (
        <Toast 
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      
      <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2 mb-4">
        ملخص الحجز
      </h3>
      
      <div className="flex items-center justify-center mb-4">
        {selectedSlot ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-row gap-2 items-center">
              <div className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold">
                {selectedDate?.date} - {selectedSlot}
              </div>
            </div>
            <p className="text-emerald-400 text-sm">تم اختيار الموعد</p>
          </div>
        ) : (
          <p className="text-gray-400">لم يتم اختيار موعد بعد</p>
        )}
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400">المعلم:</span>
          <span className="text-white font-semibold">{teacher.name}</span>
        </div>
        {teacher.isPaid && (
          <div className="flex justify-between">
            <span className="text-gray-400">السعر:</span>
            <span className="text-white font-semibold">{teacher.price} ريال</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-400">نوع الجلسة:</span>
          <span className="text-white font-semibold">{selectedType || "جلسة عادية"}</span>
        </div>
      </div>
      
      <LoadingButton 
        loading={loading}
        disabled={!selectedSlot}
        onClick={bookAppointment}
        loadingText="جاري الإرسال..."
        text={`احجز الآن ${teacher.isPaid ? `(${teacher.price} ريال)` : ''}`}
      />
      
      {errorMessage && (
        <p className="text-red-500 mt-2 text-center">{errorMessage}</p>
      )}
      
      <ConfirmDialog
        visible={showConfirmDialog}
        onConfirm={confirmCreate}
        onCancel={cancelCreate}
        loading={loading}
        notes={notes}
        setNotes={setNotes}
      />
    </div>
  );
};

export default BookingSummary;
