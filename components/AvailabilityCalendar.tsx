"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaRegClock, FaPlus, FaTimes, FaSave, FaRegCalendarAlt, FaUser, FaUsers } from 'react-icons/fa';
import { format, addDays, startOfWeek, eachDayOfInterval, isSameDay, parseISO, isAfter, isBefore, addMinutes, setHours, setMinutes } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/utils/cn';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

export type SlotType = {
  id: string;
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
  maxParticipants: number;
  isRecurring?: boolean;
  recurringDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  booked?: number; // Number of current bookings
  type?: 'private' | 'group';
};

type EditingSlot = {
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  isRecurring: boolean;
  recurringDays: number[];
  type: 'private' | 'group';
};

interface AvailabilityCalendarProps {
  teacherId?: string;
  slots: SlotType[];
  onSave?: (slots: SlotType[]) => Promise<void>;
  onSelect?: (slot: SlotType) => void;
  selectedSlotId?: string;
  editable?: boolean;
  locale?: string;
}

export default function AvailabilityCalendar({ 
  teacherId,
  slots = [], 
  onSave,
  onSelect,
  selectedSlotId,
  editable = false,
  locale = 'ar'
}: AvailabilityCalendarProps) {
  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [localSlots, setLocalSlots] = useState<SlotType[]>(slots);
  const [editingSlot, setEditingSlot] = useState<EditingSlot | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [editMode, setEditMode] = useState<'add' | 'edit'>('add');
  const [selectedDateFilter, setSelectedDateFilter] = useState<Date | null>(null);
  
  useEffect(() => {
    setLocalSlots(slots);
  }, [slots]);

  // Get days of the week based on current date
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
  }, [currentDate]);

  // Time slot options
  const timeSlotOptions = useMemo(() => {
    const options = [];
    let startTime = 6; // 6 AM
    let endTime = 23; // 11 PM
    
    for (let hour = startTime; hour <= endTime; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    
    return options;
  }, []);

  // Filter slots by selected day
  const filteredSlots = useMemo(() => {
    if (!selectedDateFilter) return localSlots;
    
    return localSlots.filter(slot => {
      const slotDate = parseISO(slot.startTime);
      
      // Check if this is the exact day
      if (isSameDay(slotDate, selectedDateFilter)) return true;
      
      // Check if it's a recurring slot and matches the day of week
      if (slot.isRecurring && slot.recurringDays) {
        const dayOfWeek = selectedDateFilter.getDay();
        return slot.recurringDays.includes(dayOfWeek);
      }
      
      return false;
    });
  }, [localSlots, selectedDateFilter]);

  // Handle navigation
  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      return direction === 'next' 
        ? addDays(prevDate, 7)
        : addDays(prevDate, -7);
    });
  };

  // Format time for display
  const formatTimeDisplay = (dateString: string): string => {
    try {
      const date = parseISO(dateString);
      return format(date, 'h:mm a', { locale: ar });
    } catch (error) {
      return dateString;
    }
  };

  // Handle add new slot
  const handleAddNewSlot = () => {
    const now = new Date();
    setEditingSlot({
      startDate: now,
      endDate: now,
      startTime: '09:00',
      endTime: '10:00',
      maxParticipants: 1,
      isRecurring: false,
      recurringDays: [now.getDay()],
      type: 'private',
    });
    setEditMode('add');
    setShowAddSlotModal(true);
  };

  // Handle edit slot
  const handleEditSlot = (slot: SlotType) => {
    const startDate = parseISO(slot.startTime);
    const endDate = parseISO(slot.endTime);
    
    setEditingSlot({
      startDate,
      endDate,
      startTime: format(startDate, 'HH:mm'),
      endTime: format(endDate, 'HH:mm'),
      maxParticipants: slot.maxParticipants || 1,
      isRecurring: slot.isRecurring || false,
      recurringDays: slot.recurringDays || [startDate.getDay()],
      type: slot.type || 'private',
    });
    setEditMode('edit');
    setShowAddSlotModal(true);
  };

  // Handle delete slot
  const handleDeleteSlot = (slotId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الموعد؟')) {
      setLocalSlots(prev => prev.filter(slot => slot.id !== slotId));
    }
  };

  // Save changes
  const handleSaveChanges = useCallback(async () => {
    if (onSave) {
      try {
        setIsSaving(true);
        await onSave(localSlots);
        setIsEditing(false);
      } catch (error) {
        console.error("Error saving slots:", error);
        alert('حدث خطأ أثناء حفظ المواعيد');
      } finally {
        setIsSaving(false);
      }
    }
  }, [localSlots, onSave]);

  // Generate slot ID
  const generateSlotId = () => {
    return `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Create or update slot
  const handleSaveSlot = () => {
    if (!editingSlot) return;
    
    // Parse time strings into date objects
    const [startHour, startMinute] = editingSlot.startTime.split(':').map(Number);
    const [endHour, endMinute] = editingSlot.endTime.split(':').map(Number);
    
    let newSlots: SlotType[] = [];

    if (editingSlot.isRecurring) {
      // Create recurring slots
      editingSlot.recurringDays.forEach(day => {
        const slotDate = new Date(editingSlot.startDate);
        const currentDay = slotDate.getDay();
        const daysToAdd = (day - currentDay + 7) % 7;
        
        const adjustedDate = addDays(slotDate, daysToAdd);
        
        const startDateTime = setMinutes(setHours(adjustedDate, startHour), startMinute);
        const endDateTime = setMinutes(setHours(new Date(adjustedDate), endHour), endMinute);
        
        newSlots.push({
          id: generateSlotId(),
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          maxParticipants: editingSlot.maxParticipants,
          isRecurring: true,
          recurringDays: [day],
          type: editingSlot.type,
        });
      });
    } else {
      // Create a single slot
      const startDateTime = setMinutes(setHours(new Date(editingSlot.startDate), startHour), startMinute);
      const endDateTime = setMinutes(setHours(new Date(editingSlot.endDate), endHour), endMinute);
      
      newSlots.push({
        id: generateSlotId(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        maxParticipants: editingSlot.maxParticipants,
        type: editingSlot.type,
      });
    }
    
    setLocalSlots(prev => [...prev, ...newSlots]);
    setShowAddSlotModal(false);
    setEditingSlot(null);
  };

  return (
    <div className="w-full rounded-lg overflow-hidden dark:bg-gray-800 bg-white shadow-md transition-all duration-300">
      {/* Calendar Header */}
      <div className="p-4 bg-emerald-600 text-white flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">جدول المواعيد المتاحة</h2>
          <p className="text-sm text-emerald-100">
            {format(currentDate, locale === 'ar' ? 'MMMM yyyy' : 'MMMM yyyy', { locale: ar })}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {editable && (
            <>
              {isEditing ? (
                <Button 
                  variant="white" 
                  rounded="full" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <FaSave size={14} />
                      حفظ التغييرات
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  variant="white" 
                  rounded="full" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => setIsEditing(true)}
                >
                  <FaPlus size={14} />
                  تعديل المواعيد
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Calendar Navigation */}
      <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
        <button 
          onClick={() => navigateWeek('prev')} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('week')} 
            className={cn(
              "px-3 py-1 rounded-md text-sm transition-colors",
              viewMode === 'week' 
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" 
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            أسبوع
          </button>
          <button 
            onClick={() => setViewMode('month')} 
            className={cn(
              "px-3 py-1 rounded-md text-sm transition-colors",
              viewMode === 'month' 
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" 
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            شهر
          </button>
          
          <button 
            onClick={() => setCurrentDate(new Date())} 
            className="px-3 py-1 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            اليوم
          </button>
        </div>
        
        <button 
          onClick={() => navigateWeek('next')} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Week View */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, idx) => (
            <div 
              key={idx} 
              className={cn(
                "text-center py-2 rounded-md cursor-pointer transition-colors text-sm font-medium",
                selectedDateFilter && isSameDay(selectedDateFilter, day)
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
              onClick={() => setSelectedDateFilter(isSameDay(selectedDateFilter || new Date(-1), day) ? null : day)}
            >
              <div className="text-gray-500 dark:text-gray-400 text-xs">
                {format(day, 'EEEE', { locale: ar })}
              </div>
              <div className={cn(
                "rounded-full w-8 h-8 mx-auto flex items-center justify-center mt-1",
                isSameDay(day, new Date()) && "bg-emerald-500 text-white"
              )}>
                {format(day, 'd', { locale: ar })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Slots list */}
        <div className="mt-6">
          {selectedDateFilter && (
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {format(selectedDateFilter, 'eeee d MMMM', { locale: ar })}
              </h3>
            </div>
          )}
          
          {filteredSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FaRegCalendarAlt size={30} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p>لا توجد مواعيد متاحة {selectedDateFilter ? 'في هذا اليوم' : ''}</p>
              {editable && isEditing && (
                <Button
                  variant="outline"
                  rounded="full"
                  className="mt-4"
                  onClick={handleAddNewSlot}
                >
                  <FaPlus className="ml-2" />
                  إضافة موعد جديد
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSlots.map(slot => (
                <div 
                  key={slot.id}
                  className={cn(
                    "border rounded-lg p-3 transition-all",
                    selectedSlotId === slot.id 
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10" 
                      : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700",
                    slot.type === 'group' && "border-blue-200 dark:border-blue-800"
                  )}
                  onClick={() => onSelect && onSelect(slot)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <FaRegClock />
                        <span>{formatTimeDisplay(slot.startTime)} - {formatTimeDisplay(slot.endTime)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {slot.type === 'private' ? (
                          <Badge variant="success" className="flex items-center gap-1 py-0.5">
                            <FaUser size={10} />
                            <span>جلسة خاصة</span>
                          </Badge>
                        ) : (
                          <Badge variant="info" className="flex items-center gap-1 py-0.5">
                            <FaUsers size={10} />
                            <span>جلسة جماعية</span>
                          </Badge>
                        )}
                        
                        {slot.isRecurring && (
                          <Badge variant="warning" className="py-0.5">
                            أسبوعي
                          </Badge>
                        )}
                      </div>
                      
                      {slot.maxParticipants > 1 && (
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          العدد: {slot.booked || 0}/{slot.maxParticipants}
                        </div>
                      )}
                    </div>
                    
                    {editable && isEditing && (
                      <div className="flex gap-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSlot(slot);
                          }}
                          className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSlot(slot.id);
                          }}
                          className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {editable && isEditing && filteredSlots.length > 0 && (
            <div className="mt-5 text-center">
              <Button
                variant="outline"
                rounded="full"
                onClick={handleAddNewSlot}
              >
                <FaPlus className="ml-2" />
                إضافة موعد جديد
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Slot Modal */}
      {showAddSlotModal && editingSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editMode === 'add' ? 'إضافة موعد جديد' : 'تعديل الموعد'}
              </h3>
              <button 
                onClick={() => setShowAddSlotModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Date picker */}
              <div>
                <label className="block mb-1 text-sm font-medium text-right">التاريخ</label>
                <input 
                  type="date"
                  value={format(editingSlot.startDate, 'yyyy-MM-dd')}
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value) : new Date();
                    setEditingSlot({
                      ...editingSlot,
                      startDate: newDate,
                      endDate: newDate,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-right"
                />
              </div>
              
              {/* Time range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-right">وقت البدء</label>
                  <select 
                    value={editingSlot.startTime}
                    onChange={(e) => setEditingSlot({...editingSlot, startTime: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-right"
                  >
                    {timeSlotOptions.map(time => (
                      <option key={`start-${time}`} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-right">وقت الانتهاء</label>
                  <select 
                    value={editingSlot.endTime}
                    onChange={(e) => setEditingSlot({...editingSlot, endTime: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-right"
                  >
                    {timeSlotOptions.filter(time => time > editingSlot.startTime).map(time => (
                      <option key={`end-${time}`} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Session Type */}
              <div>
                <label className="block mb-1 text-sm font-medium text-right">نوع الجلسة</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingSlot({...editingSlot, type: 'private', maxParticipants: 1})}
                    className={cn(
                      "flex items-center justify-center gap-2 px-3 py-2 rounded-md border-2 transition-colors",
                      editingSlot.type === 'private'
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                        : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <FaUser />
                    <span>جلسة خاصة</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setEditingSlot({...editingSlot, type: 'group', maxParticipants: 5})}
                    className={cn(
                      "flex items-center justify-center gap-2 px-3 py-2 rounded-md border-2 transition-colors",
                      editingSlot.type === 'group'
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                        : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <FaUsers />
                    <span>جلسة جماعية</span>
                  </button>
                </div>
              </div>
              
              {/* Max Participants */}
              {editingSlot.type === 'group' && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-right">الحد الأقصى للمشاركين</label>
                  <input 
                    type="number"
                    min="2"
                    max="20"
                    value={editingSlot.maxParticipants}
                    onChange={(e) => setEditingSlot({...editingSlot, maxParticipants: parseInt(e.target.value) || 2})}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                </div>
              )}
              
              {/* Recurring Options */}
              <div>
                <div className="flex items-center justify-end gap-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={editingSlot.isRecurring}
                    onChange={(e) => setEditingSlot({...editingSlot, isRecurring: e.target.checked})}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <label htmlFor="isRecurring" className="text-sm font-medium">موعد متكرر (أسبوعي)</label>
                </div>
                
                {editingSlot.isRecurring && (
                  <div className="mt-3">
                    <label className="block mb-1 text-sm font-medium text-right">أيام التكرار</label>
                    <div className="grid grid-cols-7 gap-1">
                      {['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map((day, idx) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const newDays = editingSlot.recurringDays.includes(idx)
                              ? editingSlot.recurringDays.filter(d => d !== idx)
                              : [...editingSlot.recurringDays, idx];
                            setEditingSlot({...editingSlot, recurringDays: newDays});
                          }}
                          className={cn(
                            "py-1 rounded-md text-center text-sm transition-colors",
                            editingSlot.recurringDays.includes(idx)
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                          )}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-4 mt-4 border-t dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setShowAddSlotModal(false)}
                >
                  إلغاء
                </Button>
                
                <Button
                  variant="primary"
                  onClick={handleSaveSlot}
                >
                  {editMode === 'add' ? 'إضافة الموعد' : 'حفظ التعديلات'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}