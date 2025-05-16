'use client';
import React, { useState, useEffect } from 'react';
import TeacherBooking from '@/components/booking/TeacherBooking';
import { useParams } from 'next/navigation';
import { Teacher } from '@/types';
import teachersData from '@/data/teachers';
import { SlotType } from '@/components/AvailabilityCalendar';
import { addDays, format, setHours, setMinutes, parse, addWeeks } from 'date-fns';

// Define availability data inline instead of importing from external file
const availabilityData = [
  {
    "id": "a1",
    "teacherId": "1",
    "dayOfWeek": 1,
    "startTime": "18:00",
    "endTime": "19:00",
    "maxNum": 3
  },
  {
    "id": "a2",
    "teacherId": "2",
    "dayOfWeek": 3,
    "startTime": "19:30",
    "endTime": "20:30",
    "maxNum": 2
  },
  
  {
    "id": "a3",
    "teacherId": "3",
    "dayOfWeek": 5,
    "startTime": "17:00",
    "endTime": "18:00",
    "maxNum": 4
  },
  {
    "id": "a4",
    "teacherId": "1",
    "dayOfWeek": 6,
    "startTime": "10:00",
    "endTime": "11:00",
    "maxNum": 1
  },
  {
    "id": "a5",
    "teacherId": "2",
    "dayOfWeek": 0,
    "startTime": "12:00",
    "endTime": "13:00",
    "maxNum": 5
  },
  {
    "id": "a6",
    "teacherId": "3",
    "dayOfWeek": 2,
    "startTime": "14:00",
    "endTime": "15:00",
    "maxNum": 2
  },
  {
    "id": "a7",
    "teacherId": "1",
    "dayOfWeek": 4,
    "startTime": "16:00",
    "endTime": "17:00",
    "maxNum": 3
  },
  {
    "id": "a8",
    "teacherId": "2",
    "dayOfWeek": 1,
    "startTime": "18:30",
    "endTime": "19:30",
    "maxNum": 4
  }
];

export default function BookTeacherPage() {
  const params = useParams();
  const teacherId = params?.teacherId as string;
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [availabilitySlots, setAvailabilitySlots] = useState<SlotType[]>([]);

  useEffect(() => {
    // Find the selected teacher
    const selectedTeacher = teachersData.find(t => t.id === teacherId);
    
    if (selectedTeacher) {
      setTeacher(selectedTeacher);
      
      // Generate availability slots for the next 4 weeks
      const generatedSlots = generateAvailabilitySlots(teacherId);
      setAvailabilitySlots(generatedSlots);
    }

    
  }, [teacherId]);

  // Generate availability slots for the next 4 weeks based on teacher's weekly schedule
  const generateAvailabilitySlots = (teacherId: string): SlotType[] => {
    const slots: SlotType[] = [];
    const today = new Date();
    // Using the inline data instead of imported data
    const teacherAvailability = availabilityData.filter(slot => slot.teacherId === teacherId);
    
    // Generate slots for the next 4 weeks
    for (let week = 0; week < 4; week++) {
      teacherAvailability.forEach(slot => {
        // dayOfWeek in availability.json is 0-6 (Sunday-Saturday)
        // JavaScript's getDay() also returns 0-6 (Sunday-Saturday)
        const dayOfWeek = slot.dayOfWeek;
        
        // Find the next occurrence of this day of week
        let date = addDays(today, (dayOfWeek + 7 - today.getDay()) % 7);
        // Add the current week offset
        date = addWeeks(date, week);
        
        // Parse the time strings
        const startTime = parse(slot.startTime, 'HH:mm', new Date());
        const endTime = parse(slot.endTime, 'HH:mm', new Date());
        
        // Create date objects with the correct date and time
        const slotStartDate = setHours(
          setMinutes(date, startTime.getMinutes()),
          startTime.getHours()
        );
        
        const slotEndDate = setHours(
          setMinutes(date, endTime.getMinutes()),
          endTime.getHours()
        );
        
        // Only include future slots
        if (slotStartDate > today) {
          slots.push({
            id: `${slot.id}-${format(slotStartDate, 'yyyy-MM-dd')}`,
            startTime: slotStartDate.toISOString(),
            endTime: slotEndDate.toISOString(),
            type: 'private' as const,
            maxParticipants: slot.maxNum || 1,
            booked: 0, // Using 'booked' instead of 'bookedCount' to match SlotType definition
          });
        }
      });
    }
    
    return slots;
  };



  return (
    <div className="min-h-screen  py-4">
       {teacher && (
        <TeacherBooking teacher={teacher} availabilitySlots={availabilitySlots} />
      )}
    </div>
  );
}
