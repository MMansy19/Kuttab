"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import BookingSummary from "@/components/booking/BookingSummary";
import SlotSelector from "@/components/booking/SlotSelector";
import WeekCalendar from "@/components/booking/WeekCalendar";
import { Teacher } from "@/types";

// Helper component to display teacher information
const TeacherInfo: React.FC<{ teacher: Teacher }> = ({ teacher }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-5 shadow-lg border border-gray-800">
      <div className="flex items-center gap-4 mb-3">
        {teacher.avatarUrl ? (
          <img
            src={teacher.avatarUrl}
            alt={teacher.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600"
          />
        ) : (
          <div className="w-16 h-16 bg-emerald-800 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {teacher.name.charAt(0)}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-white">{teacher.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-sm text-emerald-400">{teacher.subjects.join(', ')}</div>
            <div className="bg-gray-800 px-2 py-0.5 rounded-full text-xs text-yellow-400 font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
              {teacher.rating}
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-gray-300 text-sm mt-3 line-clamp-3">{teacher.bio}</div>
      
      <div className="flex flex-wrap gap-2 mt-3">
        {teacher.isPaid && (
          <div className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-xs">
            {teacher.price} ريال / الجلسة
          </div>
        )}
        <div className="bg-emerald-900 text-emerald-200 px-3 py-1 rounded-full text-xs">
          {teacher.experience} سنوات خبرة
        </div>
      </div>
    </div>
  );
};

// Session type selector component
const SessionTypeSelector: React.FC<{
  selectedType: string;
  onChange: (type: string) => void;
}> = ({ selectedType, onChange }) => {
  const sessionTypes = useMemo(() => [
    { id: "quran", label: "تلاوة القرآن" },
    { id: "tajweed", label: "تجويد" },
    { id: "memorization", label: "حفظ" },
    { id: "other", label: "أخرى" },
  ], []);

  return (
    <div className="bg-gray-900 rounded-lg p-5 shadow-lg border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-3 border-b border-gray-800 pb-2">
        نوع الجلسة
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {sessionTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onChange(type.id)}
            className={`py-2 px-3 rounded-lg transition-colors duration-200 ${
              selectedType === type.id
                ? "bg-emerald-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Duration selector component
const DurationSelector: React.FC<{
  selectedDuration: number;
  onChange: (duration: number) => void;
}> = ({ selectedDuration, onChange }) => {
  const durations = useMemo(() => [
    { value: 30, label: "30 دقيقة" },
    { value: 45, label: "45 دقيقة" },
    { value: 60, label: "60 دقيقة" },
  ], []);

  return (
    <div className="bg-gray-900 rounded-lg p-5 shadow-lg border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-3 border-b border-gray-800 pb-2">
        مدة الجلسة
      </h3>
      <div className="flex gap-3">
        {durations.map((duration) => (
          <button
            key={duration.value}
            onClick={() => onChange(duration.value)}
            className={`flex-1 py-2 px-3 rounded-lg transition-colors duration-200 ${
              selectedDuration === duration.value
                ? "bg-emerald-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {duration.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const TeacherBooking: React.FC<{ teacherId?: string }> = ({ teacherId }) => {
  const searchParams = useSearchParams();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Booking state
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedType, setSelectedType] = useState<string>("quran");
  const [selectedDate, setSelectedDate] = useState<{
    date: string;
    slots: { time: string; id: number; type: string }[];
  } | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Available dates and slots
  const [availableDates, setAvailableDates] = useState<{
    date: string;
    slots: { time: string; id: number; type: string }[];
  }[]>([{ date: "loading", slots: [] }]);
  
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  // Fetch teacher data
  useEffect(() => {
    const fetchTeacher = async () => {
      setLoading(true);
      
      try {
        // For demo purposes, using static data. In production, this would be an API call.
        const teachersJson = await import('@/data/teachers');
        const teachers = teachersJson.default;
        
        // Get teacher ID either from props or URL
        const id = teacherId || searchParams.get('id');
        
        if (!id) {
          throw new Error("Teacher ID not provided");
        }
        
        const foundTeacher = teachers.find(t => t.id === id);
        
        if (!foundTeacher) {
          throw new Error("Teacher not found");
        }
        
        setTeacher(foundTeacher);
        
        // Transform availableSlots into the format expected by the calendar components
        const formattedDates = transformTeacherAvailability(foundTeacher.availableSlots);
        setAvailableDates(formattedDates);
      } catch (error) {
        console.error("Error fetching teacher:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeacher();
  }, [teacherId, searchParams]);

  // Transform teacher available slots to calendar format
  const transformTeacherAvailability = (slots: string[]) => {
    // Group slots by day of the week
    const slotsByDay: Record<string, { time: string; id: number; type: string }[]> = {};
    
    slots.forEach((slot, index) => {
      const [dateStr, timeStr] = slot.split(' ');
      const date = new Date(dateStr);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      if (!slotsByDay[dayName]) {
        slotsByDay[dayName] = [];
      }
      
      slotsByDay[dayName].push({
        time: timeStr,
        id: index,
        type: "standard" // Default type
      });
    });
    
    // Convert to array format needed by calendar
    return Object.entries(slotsByDay).map(([date, slots]) => ({
      date,
      slots
    }));
  };

  // Handle date selection
  const handleDateSelect = (dateObj: {
    date: string;
    slots: { time: string; id: number; type: string }[];
  }) => {
    setSelectedSlot(null);
    setSelectedDate(dateObj);
  };

  // Handle time slot selection
  const handleSlotSelect = (slot: { time: string; type: string }) => {
    setSelectedSlot(slot.time);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="text-center p-8 text-red-500">
        لم يتم العثور على المعلم
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 p-4 bg-gray-950 text-white max-w-7xl mx-auto">
      {/* Left column - Teacher info and booking summary */}
      <div className="flex flex-col gap-4 w-full xl:w-1/3">
        <TeacherInfo teacher={teacher} />
        <SessionTypeSelector 
          selectedType={selectedType} 
          onChange={setSelectedType}
        />
        <DurationSelector 
          selectedDuration={selectedDuration} 
          onChange={setSelectedDuration} 
        />
        <BookingSummary
          selectedSlot={selectedSlot}
          selectedDuration={selectedDuration}
          selectedType={selectedType}
          teacher={teacher}
          selectedDate={selectedDate}
        />
      </div>

      {/* Right column - Calendar and slot selection */}
      <div className="flex flex-col gap-4 w-full xl:w-2/3">
        <WeekCalendar
          selectedDate={selectedDate}
          handleDateSelect={handleDateSelect}
          availableDates={availableDates}
          bookedDates={bookedDates}
        />
        <SlotSelector
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          handleSlotSelect={handleSlotSelect}
          availableDates={availableDates}
        />
      </div>
    </div>
  );
};

export default TeacherBooking;