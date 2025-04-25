import React from 'react';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';

const mockSlots = [
  '2025-04-28 18:00',
  '2025-04-29 17:00',
  '2025-04-30 19:30',
];

export default function AvailabilityPage() {
  const [selectedSlot, setSelectedSlot] = React.useState<string | undefined>();

  return (
    <div className="py-8">
      <AvailabilityCalendar
        availableSlots={mockSlots}
        selectedSlot={selectedSlot}
        onSelect={setSelectedSlot}
      />
      {selectedSlot && (
        <div className="text-center text-green-400 mt-4">تم اختيار الموعد: {selectedSlot}</div>
      )}
    </div>
  );
}
