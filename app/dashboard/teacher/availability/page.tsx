"use client";

import React, { useState } from 'react';
import AvailabilityCalendar, { SlotType } from '@/components/AvailabilityCalendar';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

// Mock slots for the availability calendar using the SlotType format
const mockSlots: SlotType[] = [
  {
    id: "slot-1",
    startTime: "2025-04-28T18:00:00.000Z",
    endTime: "2025-04-28T19:00:00.000Z",
    maxParticipants: 1,
    type: 'private'
  },
  {
    id: "slot-2",
    startTime: "2025-04-29T17:00:00.000Z",
    endTime: "2025-04-29T18:00:00.000Z",
    maxParticipants: 5,
    type: 'group'
  },
  {
    id: "slot-3",
    startTime: "2025-04-30T19:30:00.000Z", 
    endTime: "2025-04-30T20:30:00.000Z",
    maxParticipants: 1,
    isRecurring: true,
    recurringDays: [3], // Wednesday
    type: 'private'
  }
];

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<SlotType[]>(mockSlots);
  const [selectedSlot, setSelectedSlot] = useState<SlotType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSlots = async (updatedSlots: SlotType[]) => {
    try {
      setIsSaving(true);
      // In a real application, you would call an API to save the slots
      console.log("Saving slots:", updatedSlots);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSlots(updatedSlots);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error saving slots:", error);
      return Promise.reject(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المواعيد المتاحة</h1>
        
        <Link href="/dashboard/teacher">
          <Button variant="outline" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
            </svg>
            الرجوع للملف الشخصي
          </Button>
        </Link>
      </div>
      
      {saveSuccess && (
        <div className="mb-6 p-3 bg-green-100 text-green-800 rounded-md dark:bg-green-900/30 dark:text-green-400">
          تم حفظ المواعيد بنجاح
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            يمكنك من هنا تحديد الأوقات التي تكون متاحًا فيها للتدريس. يمكنك إضافة مواعيد فردية أو متكررة، وتحديد الحد الأقصى للمشاركين في كل موعد.
          </p>
          
          <AvailabilityCalendar 
            slots={slots}
            onSave={handleSaveSlots}
            onSelect={setSelectedSlot}
            editable={true}
          />
        </div>
      </div>
    </div>
  );
}
