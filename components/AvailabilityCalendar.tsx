"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaRegClock, 
  FaPlus, 
  FaTimes, 
  FaSave, 
  FaCalendarAlt, 
  FaCalendarDay,
  FaCalendarWeek,
  FaUserFriends,
  FaUser,
  FaEllipsisH,
  FaTrash,
  FaEdit
} from 'react-icons/fa';
import { format, addDays, getDay, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/utils/cn';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

export interface SlotType {
  id: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  type?: 'private' | 'group';
  maxParticipants?: number;
  booked?: number;
  description?: string;
}

export interface TimeSlot {
  id?: string;
  dayOfWeek: number;
  startTime: string; // Format: "HH:MM" (24h)
  endTime: string;   // Format: "HH:MM" (24h)
  isAvailable: boolean;
  slotType?: "private" | "group";
  maxParticipants?: number;
  duration?: number; // in minutes
  recurrence?: "weekly" | "biweekly" | "monthly";
  color?: string;
  note?: string;
}

interface AvailabilityCalendarProps {
  initialAvailability: TimeSlot[];
  onSave: (slots: TimeSlot[]) => Promise<void>;
  isSaving?: boolean;
}

// Constants
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => i).map(
  hour => `${hour.toString().padStart(2, '0')}:00`
);

export default function AvailabilityCalendar({
  initialAvailability = [],
  onSave,
  isSaving = false
}: AvailabilityCalendarProps) {
  // State
  const [slots, setSlots] = useState<TimeSlot[]>(initialAvailability);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentView, setCurrentView] = useState<"week" | "list">("list");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [hasChanges, setHasChanges] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'private' | 'group'>('all');
  const [draggedSlot, setDraggedSlot] = useState<TimeSlot | null>(null);
  
  // Update slots when initialAvailability changes
  useEffect(() => {
    setSlots(initialAvailability);
    setHasChanges(false);
  }, [initialAvailability]);

  // Generate time slot options for dropdown (15-minute intervals)
  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
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
      // Filter by view mode if needed
      if (
        viewMode === 'all' || 
        (viewMode === 'private' && (!slot.slotType || slot.slotType === 'private')) ||
        (viewMode === 'group' && slot.slotType === 'group')
      ) {
        if (grouped[slot.dayOfWeek]) {
          grouped[slot.dayOfWeek].push(slot);
        }
      }
    });
    
    // Sort slots by start time
    for (const day in grouped) {
      grouped[Number(day)].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    
    return grouped;
  }, [slots, viewMode]);

  // Get dates for the current week view
  const weekDates = useMemo(() => {
    const startDay = startOfWeek(currentDate, { weekStartsOn: 0 });
    const endDay = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: startDay, end: endDay });
  }, [currentDate]);

  // Handle adding a new slot
  const handleAddSlot = (dayOfWeek: number, startHour: string = "09:00") => {
    // Parse the hours and minutes
    const [hours, minutes] = startHour.split(':').map(Number);
    
    // Calculate end time (1 hour later)
    let endHours = hours + 1;
    let endMinutes = minutes;
    
    if (endHours >= 24) {
      endHours = endHours % 24;
    }
    
    const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

    setEditingSlot({
      dayOfWeek,
      startTime,
      endTime,
      isAvailable: true,
      slotType: "private",
      maxParticipants: 1,
      duration: 60
    });
    setShowModal(true);
  };

  // Handle editing a slot
  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot({ ...slot });
    setShowModal(true);
  };

  // Handle deleting a slot
  const handleDeleteSlot = (slotToDelete: TimeSlot) => {
    const newSlots = slots.filter(slot => 
      !(slot.id === slotToDelete.id || 
        (slot.dayOfWeek === slotToDelete.dayOfWeek && 
         slot.startTime === slotToDelete.startTime && 
         slot.endTime === slotToDelete.endTime))
    );
    
    setSlots(newSlots);
    setHasChanges(true);
  };

  // Handle saving a slot
  const handleSaveSlot = () => {
    if (!editingSlot) return;
    
    // Validate time (end time should be after start time)
    if (editingSlot.endTime <= editingSlot.startTime) {
      alert("يجب أن يكون وقت الانتهاء بعد وقت البدء");
      return;
    }
    
    // Check for overlapping slots - we'll allow group slots to overlap with private slots
    const overlappingSlot = slots.find(slot => 
      slot.dayOfWeek === editingSlot.dayOfWeek && 
      ((editingSlot.startTime >= slot.startTime && editingSlot.startTime < slot.endTime) || 
       (editingSlot.endTime > slot.startTime && editingSlot.endTime <= slot.endTime) ||
       (editingSlot.startTime <= slot.startTime && editingSlot.endTime >= slot.endTime)) &&
      (!editingSlot.id || slot.id !== editingSlot.id) &&
      (editingSlot.slotType === slot.slotType) // Only check overlap within the same type
    );
    
    if (overlappingSlot) {
      alert("هذه الفترة الزمنية تتداخل مع فترة موجودة بالفعل لنفس نوع الحصة");
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
    setHasChanges(true);
  };

  // Handle bulk actions
  const handleBulkAddWeekly = (templateSlot: TimeSlot) => {
    const newSlots = [];
    
    // Add the same slot for each day of the week
    for (let i = 0; i < 7; i++) {
      newSlots.push({
        ...templateSlot,
        dayOfWeek: i,
        id: `slot-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 9)}`
      });
    }
    
    setSlots([...slots, ...newSlots]);
    setHasChanges(true);
  };

  // Handle slot drag to change day (for week view)
  const handleSlotDragStart = (slot: TimeSlot) => {
    setDraggedSlot(slot);
  };

  const handleSlotDragOver = (e: React.DragEvent, dayOfWeek: number) => {
    e.preventDefault();
  };

  const handleSlotDrop = (e: React.DragEvent, dayOfWeek: number) => {
    e.preventDefault();
    if (!draggedSlot) return;
    
    // Move the slot to the new day
    const updatedSlot = {...draggedSlot, dayOfWeek};
    
    setSlots(slots.map(slot => 
      slot.id === draggedSlot.id ? updatedSlot : slot
    ));
    
    setDraggedSlot(null);
    setHasChanges(true);
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'م' : 'ص';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Get color based on slot type
  const getSlotColor = (slot: TimeSlot) => {
    if (!slot.isAvailable) return 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400';
    
    if (slot.slotType === 'group') {
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
    }
    
    return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
  };

  // Next week button handler
  const handleNextWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, 7));
  };

  // Previous week button handler
  const handlePrevWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, -7));
  };

  // Today button handler
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Get slot by day and time (for week view)
  const getSlotsByDayAndTime = (day: number, timeSlot: string) => {
    return slots.filter(slot => 
      slot.dayOfWeek === day && 
      slot.startTime === timeSlot
    );
  };

  // Render the list view of time slots
  const renderListView = () => {
    return (
      <div className="grid grid-cols-1 gap-6">
        {DAYS.map((day, index) => (
          <div key={day} className="border rounded-lg p-4 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium" dir="rtl">{DAY_NAMES[index]}</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAddSlot(index)}
                className="flex items-center gap-1"
                dir="rtl"
              >
                <FaPlus size={12} /> إضافة فترة
              </Button>
            </div>
            
            {slotsByDay[index].length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4" dir="rtl">
                لم يتم تحديد أوقات متاحة لهذا اليوم
              </p>
            ) : (
              <div className="space-y-2">
                {slotsByDay[index].map((slot) => (
                  <div 
                    key={slot.id} 
                    className={`flex justify-between items-center rounded p-3 ${getSlotColor(slot)}`}
                    draggable
                    onDragStart={() => handleSlotDragStart(slot)}
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <FaRegClock className="text-gray-600 dark:text-gray-400" />
                      <span className="font-medium">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                      
                      {slot.note && (
                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                          {slot.note}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {slot.slotType === 'group' && (
                        <Badge variant="secondary" dir="rtl" className="flex items-center">
                          <FaUserFriends className="ml-1" size={12} />
                          حصة جماعية ({slot.maxParticipants})
                        </Badge>
                      )}
                      
                      {(!slot.slotType || slot.slotType === 'private') && (
                        <Badge variant="outline" dir="rtl" className="flex items-center">
                          <FaUser className="ml-1" size={12} />
                          حصة فردية
                        </Badge>
                      )}
                      
                      {slot.recurrence && (
                        <Badge variant="outline" dir="rtl">
                          {slot.recurrence === "weekly" && "أسبوعيًا"}
                          {slot.recurrence === "biweekly" && "كل أسبوعين"}
                          {slot.recurrence === "monthly" && "شهريًا"}
                        </Badge>
                      )}
                      
                      <div className="dropdown dropdown-left">
                        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                          <FaEllipsisH size={14} />
                        </button>
                        
                        <div className="dropdown-content">
                          <button 
                            onClick={() => handleEditSlot(slot)}
                            className="block w-full text-right py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                          >
                            <FaEdit className="inline ml-1" /> تعديل
                          </button>
                          <button 
                            onClick={() => handleDeleteSlot(slot)}
                            className="block w-full text-right py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 text-sm"
                          >
                            <FaTrash className="inline ml-1" /> حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render the week view of time slots
  const renderWeekView = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button size="sm" variant="outline" onClick={handlePrevWeek}>السابق</Button>
            <Button size="sm" variant="outline" onClick={handleToday}>اليوم</Button>
            <Button size="sm" variant="outline" onClick={handleNextWeek}>التالي</Button>
          </div>
          
          <h3 className="font-medium">
            {format(weekDates[0], "d MMM", { locale: ar })} - {format(weekDates[6], "d MMM yyyy", { locale: ar })}
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header row with days */}
            <div className="grid grid-cols-8 gap-1 mb-1">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-center font-bold"></div>
              {weekDates.map((date, index) => (
                <div key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-center font-bold">
                  <div>{DAY_NAMES[getDay(date)]}</div>
                  <div className="text-sm">{format(date, 'd MMM', { locale: ar })}</div>
                </div>
              ))}
            </div>
            
            {/* Time slots */}
            {TIME_SLOTS.map((timeSlot, timeIndex) => (
              <div key={timeSlot} className="grid grid-cols-8 gap-1 mb-1">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-center">
                  {formatTime(timeSlot)}
                </div>
                
                {/* Cells for each day */}
                {weekDates.map((date, dayIndex) => {
                  const dayOfWeek = getDay(date);
                  const daySlots = getSlotsByDayAndTime(dayOfWeek, timeSlot);
                  
                  return (
                    <div 
                      key={dayIndex} 
                      className={`p-2 border border-gray-200 dark:border-gray-700 rounded-md min-h-[60px] 
                        ${daySlots.length === 0 ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`}
                      onClick={() => {
                        if (daySlots.length === 0) {
                          handleAddSlot(dayOfWeek, timeSlot);
                        }
                      }}
                      onDragOver={(e) => handleSlotDragOver(e, dayOfWeek)}
                      onDrop={(e) => handleSlotDrop(e, dayOfWeek)}
                    >
                      {daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-1 mb-1 rounded text-sm ${getSlotColor(slot)}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSlot(slot);
                          }}
                          draggable
                          onDragStart={() => handleSlotDragStart(slot)}
                        >
                          <div className="font-medium">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</div>
                          {slot.slotType === 'group' && (
                            <div className="text-xs flex items-center">
                              <FaUserFriends className="ml-1" size={10} />
                              حصة جماعية ({slot.maxParticipants})
                            </div>
                          )}
                          {slot.note && <div className="text-xs truncate">{slot.note}</div>}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render the edit modal
  const renderEditModal = () => {
    if (!showModal || !editingSlot) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium" dir="rtl">
              {editingSlot.id ? 'تعديل الفترة الزمنية' : 'إضافة فترة زمنية'}
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
              <label className="block mb-1 text-sm font-medium text-right" dir="rtl">اليوم</label>
              <select 
                value={editingSlot.dayOfWeek}
                onChange={(e) => setEditingSlot({...editingSlot, dayOfWeek: Number(e.target.value)})}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-right"
                dir="rtl"
              >
                {DAY_NAMES.map((day, index) => (
                  <option key={day} value={index}>{day}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-right" dir="rtl">وقت البدء</label>
                <select 
                  value={editingSlot.startTime}
                  onChange={(e) => setEditingSlot({...editingSlot, startTime: e.target.value})}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                  dir="rtl"
                >
                  {timeOptions.map(time => (
                    <option key={`start-${time}`} value={time}>{formatTime(time)}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-right" dir="rtl">وقت الانتهاء</label>
                <select 
                  value={editingSlot.endTime}
                  onChange={(e) => setEditingSlot({...editingSlot, endTime: e.target.value})}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                  dir="rtl"
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
            
            <div>
              <label className="block mb-1 text-sm font-medium text-right" dir="rtl">نوع الحصة</label>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <label className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input 
                    type="radio" 
                    checked={!editingSlot.slotType || editingSlot.slotType === 'private'} 
                    onChange={() => setEditingSlot({...editingSlot, slotType: 'private', maxParticipants: 1})}
                  />
                  <span>حصة فردية</span>
                </label>
                
                <label className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input 
                    type="radio" 
                    checked={editingSlot.slotType === 'group'} 
                    onChange={() => setEditingSlot({...editingSlot, slotType: 'group', maxParticipants: 5})}
                  />
                  <span>حصة جماعية</span>
                </label>
              </div>
            </div>
            
            {editingSlot.slotType === 'group' && (
              <div>
                <label className="block mb-1 text-sm font-medium text-right" dir="rtl">عدد المشاركين الأقصى</label>
                <input 
                  type="number" 
                  min={2} 
                  value={editingSlot.maxParticipants || 5}
                  onChange={(e) => setEditingSlot({...editingSlot, maxParticipants: Number(e.target.value)})}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-right"
                  dir="rtl"
                />
              </div>
            )}
            
            <div>
              <label className="block mb-1 text-sm font-medium text-right" dir="rtl">مدة الحصة (بالدقائق)</label>
              <select 
                value={editingSlot.duration || 60}
                onChange={(e) => setEditingSlot({...editingSlot, duration: Number(e.target.value)})}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-right"
                dir="rtl"
              >
                <option value={30}>30 دقيقة</option>
                <option value={45}>45 دقيقة</option>
                <option value={60}>ساعة واحدة</option>
                <option value={90}>ساعة ونصف</option>
                <option value={120}>ساعتين</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-right" dir="rtl">التكرار</label>
              <select 
                value={editingSlot.recurrence || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setEditingSlot({
                    ...editingSlot, 
                    recurrence: value ? value as "weekly" | "biweekly" | "monthly" : undefined
                  });
                }}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-right"
                dir="rtl"
              >
                <option value="">لا يتكرر</option>
                <option value="weekly">أسبوعيًا</option>
                <option value="biweekly">كل أسبوعين</option>
                <option value="monthly">شهريًا</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-right" dir="rtl">ملاحظات (اختياري)</label>
              <input 
                type="text"
                value={editingSlot.note || ''}
                onChange={(e) => setEditingSlot({...editingSlot, note: e.target.value})}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-right"
                dir="rtl"
                placeholder="مثلًا: للمبتدئين، تجويد، حفظ..."
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            {editingSlot.id && (
              <Button 
                variant="danger"
                onClick={() => {
                  handleDeleteSlot(editingSlot);
                  setShowModal(false);
                }}
              >
                حذف
              </Button>
            )}
            
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button 
                variant="outline" 
                onClick={() => setShowModal(false)}
              >
                إلغاء
              </Button>
              <Button onClick={handleSaveSlot}>حفظ</Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button
            size="sm"
            variant={currentView === "list" ? "default" : "outline"}
            onClick={() => setCurrentView("list")}
            className="flex items-center gap-1"
          >
            <FaCalendarAlt className="ml-1" size={14} />
            قائمة
          </Button>
          <Button
            size="sm"
            variant={currentView === "week" ? "default" : "outline"}
            onClick={() => setCurrentView("week")}
            className="flex items-center gap-1"
          >
            <FaCalendarWeek className="ml-1" size={14} />
            أسبوعي
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-1">
            <button
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'all' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
              onClick={() => setViewMode('all')}
            >
              الكل
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'private' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
              onClick={() => setViewMode('private')}
            >
              فردي
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'group' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
              onClick={() => setViewMode('group')}
            >
              جماعي
            </button>
          </div>
        </div>
      </div>
      
      {/* Calendar view */}
      <div>
        {currentView === "list" ? renderListView() : renderWeekView()}
      </div>
      
      {/* Save button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => onSave(slots)} 
          disabled={isSaving || !hasChanges}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <FaSave className="ml-2" />
              <span>حفظ الجدول الزمني</span>
            </>
          )}
        </Button>
      </div>
      
      {/* Edit Modal */}
      {renderEditModal()}
      
      {/* Drag and drop instructions */}
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center" dir="rtl">
        نصائح: يمكنك سحب الفترات الزمنية وإفلاتها لنقلها بين الأيام. انقر على أي مساحة فارغة لإضافة فترة جديدة.
      </div>
    </div>
  );
}