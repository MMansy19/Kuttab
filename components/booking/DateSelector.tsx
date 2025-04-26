import React, { useMemo } from "react";

interface DateSelectorProps {
  selectedDate: { date: string; slots: any[] } | null;
  handleDateSelect: (date: string) => void;
  availableDates: { date: string; slots: any[] }[];
}

// Helper component for individual date button
const DateButton: React.FC<{
  date: string;
  isSelected: boolean;
  hasSlots: boolean;
  onClick: () => void;
}> = ({ date, isSelected, hasSlots, onClick }) => {
  // Format date for display
  const formattedDate = useMemo(() => {
    if (!date || date === "loading") return "";
    
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const dayName = new Intl.DateTimeFormat('ar-EG', { weekday: 'short' }).format(dateObj);
    
    return { day, dayName };
  }, [date]);

  return (
    <button
      onClick={onClick}
      disabled={!hasSlots}
      className={`px-3 py-2 rounded-lg transition-colors duration-200 flex flex-col items-center justify-center ${
        isSelected
          ? "bg-emerald-600 text-white border-2 border-emerald-800"
          : hasSlots
          ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
          : "bg-gray-900 text-gray-500 cursor-not-allowed border border-gray-800"
      }`}
      aria-label={`Select date ${date}`}
    >
      <span className="text-lg font-bold">{formattedDate.day}</span>
      <span className="text-xs opacity-80">{formattedDate.dayName}</span>
    </button>
  );
};

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  handleDateSelect,
  availableDates,
}) => {
  // Filter out dates with no available slots
  const datesWithSlots = useMemo(() => 
    availableDates.filter(date => 
      date.date !== "loading" && date.slots && date.slots.length > 0
    ),
    [availableDates]
  );

  const isLoading = useMemo(() => 
    availableDates.length === 1 && availableDates[0].date === "loading", 
    [availableDates]
  );

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-4 mb-4 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-2">اختر التاريخ:</h3>
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-500 mr-2 text-sm">جاري تحميل المواعيد...</p>
        </div>
      ) : datesWithSlots.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
          {availableDates.map((date) => (
            <DateButton
              key={date.date}
              date={date.date}
              isSelected={selectedDate?.date === date.date}
              hasSlots={date.slots && date.slots.length > 0}
              onClick={() => handleDateSelect(date.date)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400">
          لا توجد تواريخ متاحة للحجز في الوقت الحالي
        </div>
      )}
    </div>
  );
};

export default DateSelector;
