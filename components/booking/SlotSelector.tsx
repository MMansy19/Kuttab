import React, { useMemo } from "react";

interface Slot {
  time: string;
  id: number;
  type: string;
}

interface SlotSelectorProps {
  selectedDate: {
    date: string;
    slots: Slot[];
  } | null;
  selectedSlot: string | null;
  handleSlotSelect: (slot: { time: string; type: string }) => void;
  availableDates: {
    date: string;
    slots: Slot[];
  }[];
}

// Separate component for individual time slot
const TimeSlot: React.FC<{
  slot: Slot;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ slot, isSelected, onSelect }) => (
  <div className="flex flex-col gap-1">
    <button
      key={slot.id}
      onClick={onSelect}
      className={`p-3 rounded-lg border text-center transition-colors duration-200 ${
        isSelected
          ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800"
          : "bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
      }`}
      aria-label={`Select time slot at ${slot.time}`}
    >
      {slot.time}
    </button>
    <p
      className={`text-xs text-center font-semibold ${
        isSelected ? "text-emerald-400" : "text-gray-400"
      }`}
    >
      {slot.type}
    </p>
  </div>
);

// Component to display when no slots are available
const NoSlotsMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="w-16 h-16 mb-4 text-gray-500 opacity-50">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <p className="text-gray-400 text-center text-sm md:text-base">{message}</p>
  </div>
);

const SlotSelector: React.FC<SlotSelectorProps> = ({
  selectedDate,
  selectedSlot,
  handleSlotSelect,
  availableDates,
}) => {
  const isLoading = useMemo(() => 
    availableDates.length === 1 && availableDates[0].date === "loading", 
    [availableDates]
  );

  const hasNoAvailableDates = useMemo(() => 
    availableDates.length === 0, 
    [availableDates]
  );

  return (
    <div className="flex gap-4 flex-col bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-800">
      <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
        <h3 className="text-sm lg:text-xl font-semibold text-white">اختر الموعد المناسب</h3>
        {selectedDate?.slots?.length ? (
          <div className="text-emerald-500 font-bold text-xs lg:text-base">
            {selectedDate.slots.length} مواعيد متاحة
          </div>
        ) : null}
      </div>

      {hasNoAvailableDates ? (
        <NoSlotsMessage message="لا توجد مواعيد متاحة للحجز في الوقت الحالي. يرجى المحاولة لاحقاً." />
      ) : isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-500 mr-2">جاري تحميل المواعيد المتاحة...</p>
        </div>
      ) : (
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-gray-800 h-52 py-2">
          {selectedDate ? (
            selectedDate.slots?.length > 0 ? (
              <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {selectedDate.slots.map((slot) => (
                  <TimeSlot 
                    key={slot.id}
                    slot={slot}
                    isSelected={selectedSlot === slot.time}
                    onSelect={() => handleSlotSelect(slot)}
                  />
                ))}
              </div>
            ) : (
              <NoSlotsMessage message="لا توجد مواعيد متاحة في هذا اليوم، يرجى اختيار يوم آخر." />
            )
          ) : (
            <NoSlotsMessage message="اختر تاريخاً لرؤية المواعيد المتاحة." />
          )}
        </div>
      )}
    </div>
  );
};

export default SlotSelector;
