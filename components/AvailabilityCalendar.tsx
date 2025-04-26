import React from 'react';

interface AvailabilityCalendarProps {
  availableSlots: string[];
  onSelect: (slot: string) => void;
  selectedSlot?: string;
}

const SlotButton: React.FC<{ slot: string; isSelected: boolean; onClick: () => void }> = ({ slot, isSelected, onClick }) => (
  <button
    type="button"
    className={`w-full py-2 rounded text-white font-semibold transition ${isSelected ? 'bg-blue-700' : 'bg-gray-700 hover:bg-blue-800'}`}
    onClick={onClick}
  >
    {slot}
  </button>
);

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ availableSlots, onSelect, selectedSlot }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-300 flex flex-col gap-4 w-full max-w-md mx-auto mt-8">
      <h3 className="text-lg font-bold text-emerald-900 dark:text-white mb-2 text-center">
        اختر موعد الجلسة
      </h3>
      {availableSlots.length === 0 ? (
        <div className="text-gray-400 text-center">لا يوجد أوقات متاحة حالياً</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {availableSlots.map(slot => (
            <li key={slot}>
              <SlotButton
                slot={slot}
                isSelected={selectedSlot === slot}
                onClick={() => onSelect(slot)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AvailabilityCalendar;