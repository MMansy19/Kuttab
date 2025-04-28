"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { FaRegClock, FaPlus, FaTimes, FaSave } from 'react-icons/fa';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';
import Button from './ui/Button';
import Badge from './ui/Badge';

interface TimeSlot {
  id?: string;
  dayOfWeek: number;
  startTime: string; // Format: "HH:MM" (24h)
  endTime: string;   // Format: "HH:MM" (24h)
  isAvailable: boolean;
}

interface AvailabilityCalendarProps {
  initialAvailability: TimeSlot[];
  onSave: (slots: TimeSlot[]) => Promise<void>;
  isSaving?: boolean;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export default function AvailabilityCalendar({
  initialAvailability = [],
  onSave,
  isSaving = false
}: AvailabilityCalendarProps) {
  const [slots, setSlots] = useState<TimeSlot[]>(initialAvailability);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    setSlots(initialAvailability);
  }, [initialAvailability]);

  // Generate time slot options for dropdown
  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  }, []);

  // Group slots by day of week
  const slotsByDay = useMemo(() => {
    const grouped: { [key: number]: TimeSlot[] } = {};
    
    // Initialize empty arrays for each day
    for (let i = 0; i < 7; i++) {
      grouped[i] = [];
    }
    
    // Add slots to their respective days
    slots.forEach(slot => {
      if (grouped[slot.dayOfWeek]) {
        grouped[slot.dayOfWeek].push(slot);
      }
    });
    
    // Sort slots by start time
    for (const day in grouped) {
      grouped[Number(day)].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    
    return grouped;
  }, [slots]);

  const handleAddSlot = (dayOfWeek: number) => {
    setEditingSlot({
      dayOfWeek,
      startTime: "09:00",
      endTime: "10:00",
      isAvailable: true
    });
    setShowModal(true);
  };

  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot({ ...slot });
    setShowModal(true);
  };

  const handleDeleteSlot = (slotToDelete: TimeSlot) => {
    setSlots(slots.filter(slot => 
      !(slot.dayOfWeek === slotToDelete.dayOfWeek && 
        slot.startTime === slotToDelete.startTime && 
        slot.endTime === slotToDelete.endTime)
    ));
  };

  const handleSaveSlot = () => {
    if (!editingSlot) return;
    
    // Validate time (end time should be after start time)
    if (editingSlot.endTime <= editingSlot.startTime) {
      alert("End time must be after start time");
      return;
    }
    
    // Check for overlapping slots
    const overlappingSlot = slots.find(slot => 
      slot.dayOfWeek === editingSlot.dayOfWeek && 
      ((editingSlot.startTime >= slot.startTime && editingSlot.startTime < slot.endTime) || 
       (editingSlot.endTime > slot.startTime && editingSlot.endTime <= slot.endTime) ||
       (editingSlot.startTime <= slot.startTime && editingSlot.endTime >= slot.endTime)) &&
      (!editingSlot.id || slot.id !== editingSlot.id) // Ignore the slot being edited
    );
    
    if (overlappingSlot) {
      alert("This time slot overlaps with an existing slot");
      return;
    }
    
    if (editingSlot.id) {
      // Update existing slot
      setSlots(slots.map(slot => 
        slot.id === editingSlot.id ? editingSlot : slot
      ));
    } else {
      // Add new slot with generated id
      setSlots([...slots, { 
        ...editingSlot, 
        id: `slot-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` 
      }]);
    }
    
    setShowModal(false);
    setEditingSlot(null);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="space-y-6">
      {/* Save button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => onSave(slots)} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <FaSave /> Save Schedule
            </>
          )}
        </Button>
      </div>
      
      {/* Day slots */}
      <div className="grid grid-cols-1 gap-6">
        {DAYS.map((day, index) => (
          <div key={day} className="border rounded-lg p-4 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{DAY_NAMES[index]}</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAddSlot(index)}
                className="flex items-center gap-1"
              >
                <FaPlus size={12} /> Add Slot
              </Button>
            </div>
            
            {slotsByDay[index].length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No availability set for this day
              </p>
            ) : (
              <div className="space-y-2">
                {slotsByDay[index].map((slot, slotIndex) => (
                  <div 
                    key={slotIndex} 
                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded p-3"
                  >
                    <div className="flex items-center space-x-2">
                      <FaRegClock className="text-gray-400" />
                      <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="success">Available</Badge>
                      
                      <button 
                        onClick={() => handleEditSlot(slot)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <button 
                        onClick={() => handleDeleteSlot(slot)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Edit Modal */}
      {showModal && editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {editingSlot.id ? 'Edit Time Slot' : 'Add Time Slot'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Day</label>
                <select 
                  value={editingSlot.dayOfWeek}
                  onChange={(e) => setEditingSlot({...editingSlot, dayOfWeek: Number(e.target.value)})}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                  disabled={editingSlot.id !== undefined}
                >
                  {DAY_NAMES.map((day, index) => (
                    <option key={day} value={index}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Start Time</label>
                  <select 
                    value={editingSlot.startTime}
                    onChange={(e) => setEditingSlot({...editingSlot, startTime: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                  >
                    {timeOptions.map(time => (
                      <option key={`start-${time}`} value={time}>{formatTime(time)}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium">End Time</label>
                  <select 
                    value={editingSlot.endTime}
                    onChange={(e) => setEditingSlot({...editingSlot, endTime: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                  >
                    {timeOptions
                      .filter(time => time > editingSlot.startTime)
                      .map(time => (
                        <option key={`end-${time}`} value={time}>{formatTime(time)}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveSlot}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}