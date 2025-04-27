"use client";

import React from 'react';
import { SlotType } from '../AvailabilityCalendar';
import { parseISO, format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { FaUser, FaUsers, FaRegClock, FaCheckCircle } from 'react-icons/fa';
import { cn } from '@/utils/cn';

interface SlotSelectorProps {
  slots: SlotType[];
  selectedSlotId?: string;
  onSelectSlot: (slot: SlotType) => void;
}

export default function SlotSelector({ slots, selectedSlotId, onSelectSlot }: SlotSelectorProps) {
  // Group slots by type (private or group)
  const privateSlots = slots.filter(slot => slot.type === 'private' || !slot.type);
  const groupSlots = slots.filter(slot => slot.type === 'group');
  
  // Format time for display
  const formatTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'h:mm a', { locale: ar });
    } catch (error) {
      return '';
    }
  };
  
  // Calculate slot availability (how many seats are left)
  const getAvailability = (slot: SlotType) => {
    if (!slot.maxParticipants || slot.maxParticipants === 1) return null;
    
    const booked = slot.booked || 0;
    const available = slot.maxParticipants - booked;
    
    return {
      available,
      total: slot.maxParticipants,
      isFull: available <= 0
    };
  };

  return (
    <div className="w-full">
      {/* Private Sessions */}
      {privateSlots.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FaUser className="text-emerald-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">جلسات خاصة</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {privateSlots.map(slot => (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSelectSlot(slot)}
                className={cn(
                  "p-3 rounded-lg border transition-colors flex flex-col items-center justify-center hover:border-emerald-500",
                  selectedSlotId === slot.id
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500"
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                )}
              >
                <div className="flex items-center gap-1 mb-1">
                  <FaRegClock className="text-emerald-500" size={12} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatTime(slot.startTime)}
                  </span>
                </div>
                
                {selectedSlotId === slot.id && (
                  <FaCheckCircle className="text-emerald-500 mt-2" size={16} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Group Sessions */}
      {groupSlots.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FaUsers className="text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">جلسات جماعية</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {groupSlots.map(slot => {
              const availability = getAvailability(slot);
              const isFull = availability?.isFull || false;
              
              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isFull}
                  onClick={() => !isFull && onSelectSlot(slot)}
                  className={cn(
                    "p-3 rounded-lg border transition-colors flex flex-col items-center relative",
                    selectedSlotId === slot.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                      : isFull
                      ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60 cursor-not-allowed"
                      : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-500"
                  )}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <FaRegClock className="text-blue-500" size={12} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatTime(slot.startTime)}
                    </span>
                  </div>
                  
                  {availability && (
                    <div className={cn(
                      "text-xs mt-1",
                      isFull ? "text-red-500" : "text-gray-500 dark:text-gray-400"
                    )}>
                      {isFull
                        ? "مكتمل"
                        : `${availability.available}/${availability.total} متاح`}
                    </div>
                  )}
                  
                  {selectedSlotId === slot.id && (
                    <FaCheckCircle className="text-blue-500 mt-2" size={16} />
                  )}
                  
                  {isFull && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-900/10 dark:bg-black/40">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                        مكتمل
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {slots.length === 0 && (
        <div className="text-center py-8">
          <FaRegClock className="mx-auto text-gray-400 text-4xl mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            لا توجد مواعيد متاحة في هذا اليوم
          </p>
        </div>
      )}
    </div>
  );
}
