import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isBefore
} from "date-fns";
import { ar } from 'date-fns/locale';

interface WeekCalendarProps {
  availableDates: {
    date: string;
    slots: { time: string; id: number; type: string }[];
  }[];
  handleDateSelect: (date: {
    date: string;
    slots: { time: string; id: number; type: string }[];
  }) => void;
  selectedDate: {
    date: string;
    slots: { time: string; id: number; type: string }[];
  } | null;
  bookedDates: string[];
}

// Day button component for better code structure
const DayButton: React.FC<{
  dateObj: {
    date: string;
    slots: { time: string; id: number; type: string }[];
  };
  isSelected: boolean;
  onClick: () => void;
}> = ({ dateObj, isSelected, onClick }) => {
  const dayDate = new Date(dateObj.date);
  const isCurrentDay = isToday(dayDate);
  const isPastDay = isBefore(dayDate, new Date()) && !isToday(dayDate);
  const hasSlots = dateObj.slots.length > 0;
  
  // Format date for Arabic display
  const dayNumber = format(dayDate, "d");
  const dayName = format(dayDate, "EEE", { locale: ar });
  
  return (
    <button
      onClick={onClick}
      disabled={isPastDay || !hasSlots}
      className={`
        p-3 rounded-lg transition-colors duration-200 flex flex-col items-center justify-center
        ${isSelected 
          ? "bg-emerald-600 text-white border-2 border-emerald-800" 
          : isPastDay 
            ? "bg-gray-900 text-gray-600 cursor-not-allowed opacity-50 border border-gray-800" 
            : hasSlots 
              ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700" 
              : "bg-gray-900 text-gray-500 cursor-not-allowed border border-gray-800"
        }
        ${isCurrentDay && !isSelected ? "ring-2 ring-emerald-500" : ""}
      `}
      aria-label={`Select date ${dateObj.date}${hasSlots ? '' : ' (no available slots)'}`}
      aria-disabled={isPastDay || !hasSlots}
      aria-selected={isSelected}
    >
      <span className={`text-lg font-bold ${isCurrentDay && !isSelected ? "text-emerald-400" : ""}`}>
        {dayNumber}
      </span>
      <span className="text-xs opacity-80">{dayName}</span>
      {hasSlots && (
        <span className="text-xs mt-1 bg-emerald-900 px-2 py-0.5 rounded-full text-emerald-300">
          {dateObj.slots.length}
        </span>
      )}
    </button>
  );
};

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  availableDates,
  handleDateSelect,
  selectedDate,
  bookedDates,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Memoize the week range for better performance
  const weekRange = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return { start, end };
  }, [currentDate]);
  
  // Get array of days in the current week range
  const daysInWeek = useMemo(() => 
    eachDayOfInterval({ start: weekRange.start, end: weekRange.end }),
    [weekRange]
  );
  
  // Create a Set of booked dates for faster lookup
  const bookedDatesSet = useMemo(() => 
    new Set(bookedDates),
    [bookedDates]
  );
  
  // Calculate dates with available slots
  const datesWithSlots = useMemo(() => {
    return daysInWeek.map(day => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayStr = format(day, "EEEE");
      
      // Find slots for this day
      const existingDate = availableDates.find(d => d.date === dayStr);
      
      // Filter out booked slots
      const availableSlots = existingDate?.slots.filter(slot => {
        const slotDateTime = `${dateStr} ${slot.time}`;
        return !bookedDatesSet.has(slotDateTime);
      }) || [];
      
      return {
        date: dateStr,
        slots: availableSlots,
      };
    });
  }, [daysInWeek, availableDates, bookedDatesSet]);
  
  // Navigation handlers
  const handlePreviousWeek = useCallback(() => 
    setCurrentDate(prev => addDays(prev, -7)),
    []
  );
  
  const handleNextWeek = useCallback(() => 
    setCurrentDate(prev => addDays(prev, 7)),
    []
  );

  // Format week range display
  const weekRangeDisplay = useMemo(() => {
    const startFormatted = format(weekRange.start, "d MMM", { locale: ar });
    const endFormatted = format(weekRange.end, "d MMM", { locale: ar });
    return `${startFormatted} - ${endFormatted}`;
  }, [weekRange]);

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-4 mb-4 border border-gray-800">
      <div className="flex flex-row items-center mb-4 border-b border-gray-800 pb-3">
        <h3 className="text-lg font-semibold text-white">اختر التاريخ:</h3>
        <div className="mr-auto flex items-center">
          <button
            onClick={handlePreviousWeek}
            className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors duration-200"
            aria-label="Previous week"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="mx-3 text-white font-medium text-sm md:text-base">
            {weekRangeDisplay}
          </span>
          <button
            onClick={handleNextWeek}
            className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors duration-200"
            aria-label="Next week"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
        {datesWithSlots.map((dateObj) => (
          <DayButton 
            key={dateObj.date}
            dateObj={dateObj}
            isSelected={selectedDate?.date === dateObj.date}
            onClick={() => handleDateSelect(dateObj)}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekCalendar;
