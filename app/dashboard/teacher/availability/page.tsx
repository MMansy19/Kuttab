"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { format, startOfWeek, endOfWeek, addWeeks, eachDayOfInterval, isSameDay, addDays, getDay } from "date-fns";
import { ar } from "date-fns/locale";
import { 
  FaCalendarAlt, 
  FaCalendarWeek, 
  FaRegClock, 
  FaPlus, 
  FaSave, 
  FaTimes, 
  FaRegCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaCopy,
  FaRegClone,
  FaTrash,
  FaUndo
} from "react-icons/fa";

interface TimeSlot {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  slotType?: "private" | "group";
  maxParticipants?: number;
  duration?: number; // in minutes
  recurrence?: "weekly" | "biweekly" | "monthly";
  color?: string;
  note?: string;
}

interface TeacherProfile {
  id: string;
  availabilityTemplates?: AvailabilityTemplate[];
}

interface AvailabilityTemplate {
  id: string;
  name: string;
  slots: TimeSlot[];
}

// Day names in Arabic
const DAY_NAMES = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const DEFAULT_SLOT_DURATION = 60; // 1 hour in minutes

export default function AvailabilityPage() {
  const { data: session } = useSession();
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [availabilities, setAvailabilities] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<"week" | "month" | "list">("week");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [availabilityTemplates, setAvailabilityTemplates] = useState<AvailabilityTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AvailabilityTemplate | null>(null);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [pendingChanges, setPendingChanges] = useState<boolean>(false);

  const [slotForm, setSlotForm] = useState({
    dayOfWeek: 0,
    startTime: "09:00",
    endTime: "10:00",
    isAvailable: true,
    slotType: "private" as "private" | "group",
    maxParticipants: 1,
    duration: DEFAULT_SLOT_DURATION,
    recurrence: undefined as "weekly" | "biweekly" | "monthly" | undefined,
    note: ""
  });

  useEffect(() => {
    if (editingSlot) {
      setSlotForm({
        dayOfWeek: editingSlot.dayOfWeek || 0,
        startTime: editingSlot.startTime || "09:00",
        endTime: editingSlot.endTime || "10:00",
        isAvailable: editingSlot.isAvailable !== false,
        slotType: editingSlot.slotType || "private",
        maxParticipants: editingSlot.maxParticipants || 1,
        duration: editingSlot.duration || DEFAULT_SLOT_DURATION,
        recurrence: editingSlot.recurrence,
        note: editingSlot.note || ""
      });
    }
  }, [editingSlot]);

  const [bulkForm, setBulkForm] = useState({
    days: [1, 3, 5], // Default to Mon, Wed, Fri
    startTime: "17:00",
    endTime: "18:00",
    slotType: "private" as "private" | "group",
    maxParticipants: 1
  });

  const [templateName, setTemplateName] = useState("");

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      if (!session?.user.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch the teacher profile
        const profileResponse = await fetch(`/api/users/${session.user.id}`);
        if (!profileResponse.ok) {
          throw new Error("Failed to fetch teacher profile");
        }
        const profileData = await profileResponse.json();
        
        if (!profileData.teacherProfile) {
          throw new Error("Teacher profile not found");
        }
        
        setTeacherProfile(profileData.teacherProfile);
        
        // Fetch the teacher's availabilities
        const availabilityResponse = await fetch(`/api/teachers/${profileData.teacherProfile.id}/availability`);
        if (!availabilityResponse.ok) {
          throw new Error("Failed to fetch availabilities");
        }
        const availabilityData = await availabilityResponse.json();
        
        // If no availabilities found, create a default set
        if (!availabilityData.length) {
          setAvailabilities([]);
        } else {
          setAvailabilities(availabilityData);
        }
        
        // Fetch availability templates if they exist
        if (profileData.teacherProfile.availabilityTemplates) {
          setAvailabilityTemplates(profileData.teacherProfile.availabilityTemplates);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherProfile();
  }, [session]);

  const handleSaveAvailability = async (slots: TimeSlot[]) => {
    try {
      if (!teacherProfile) return;
      
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await fetch(`/api/teachers/${teacherProfile.id}/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(slots),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save availability");
      }
      
      const data = await response.json();
      setAvailabilities(data.availabilities);
      setSuccessMessage("تم حفظ جدولك الزمني بنجاح!");
      setPendingChanges(false);
      
      // Hide the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate dates for the current view (week or month)
  const getDatesForCurrentView = () => {
    if (currentView === "week") {
      // Get start of the week (Sunday) and end of the week (Saturday)
      const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
      const endDate = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: startDate, end: endDate });
    } else if (currentView === "month") {
      // This is simplified - a real implementation would handle the full month grid
      const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
      const endDate = addDays(startDate, 27); // Display 4 weeks in grid view
      return eachDayOfInterval({ start: startDate, end: endDate });
    }
    return [];
  };

  // Navigate to previous week or month
  const navigatePrevious = () => {
    setCurrentDate(prev => 
      currentView === "week" 
        ? addWeeks(prev, -1) 
        : addWeeks(prev, -4)
    );
  };

  // Navigate to next week or month
  const navigateNext = () => {
    setCurrentDate(prev => 
      currentView === "week" 
        ? addWeeks(prev, 1) 
        : addWeeks(prev, 4)
    );
  };

  // Navigate to today
  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  // Get slot for a specific day and time
  const getSlotForDayAndTime = (day: number, time: string) => {
    return availabilities.find(
      slot => slot.dayOfWeek === day && slot.startTime === time
    );
  };

  // Handle adding a new slot
  const handleAddSlot = (day: number, hour: number, minute: number = 0) => {
    const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const endHour = (hour + 1) % 24;
    const endTime = `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    const newSlot: TimeSlot = {
      dayOfWeek: day,
      startTime,
      endTime,
      isAvailable: true,
      slotType: "private",
      duration: DEFAULT_SLOT_DURATION
    };
    
    setEditingSlot(newSlot);
    setIsEditModalOpen(true);
  };

  // Handle saving a slot (new or edited)
  const handleSaveSlot = (slot: TimeSlot) => {
    const newAvailabilities = [...availabilities];
    
    // If it's an edit, find and update the slot
    if (slot.id) {
      const index = newAvailabilities.findIndex(s => s.id === slot.id);
      if (index >= 0) {
        newAvailabilities[index] = slot;
      }
    } else {
      // If it's a new slot, add it
      newAvailabilities.push(slot);
    }
    
    setAvailabilities(newAvailabilities);
    setIsEditModalOpen(false);
    setEditingSlot(null);
    setPendingChanges(true);
  };

  // Handle deleting a slot
  const handleDeleteSlot = (slotId: string) => {
    const newAvailabilities = availabilities.filter(slot => slot.id !== slotId);
    setAvailabilities(newAvailabilities);
    setIsEditModalOpen(false);
    setEditingSlot(null);
    setPendingChanges(true);
  };

  // Handle bulk edit of slots
  const handleBulkEdit = (payload: {
    days: number[], 
    startTime: string, 
    endTime: string,
    slotType: "private" | "group",
    maxParticipants?: number,
    recurrence?: "weekly" | "biweekly" | "monthly"
  }) => {
    const { days, startTime, endTime, slotType, maxParticipants, recurrence } = payload;
    const newSlots: TimeSlot[] = [];
    
    days.forEach(day => {
      newSlots.push({
        dayOfWeek: day,
        startTime,
        endTime,
        isAvailable: true,
        slotType,
        maxParticipants: maxParticipants || 1,
        recurrence,
        duration: DEFAULT_SLOT_DURATION
      });
    });
    
    setAvailabilities([...availabilities, ...newSlots]);
    setIsBulkEditModalOpen(false);
    setPendingChanges(true);
  };

  // Handle saving an availability template
  const handleSaveTemplate = (name: string) => {
    if (!teacherProfile) return;
    
    const newTemplate: AvailabilityTemplate = {
      id: `template-${Date.now()}`,
      name,
      slots: [...availabilities]
    };
    
    const updatedTemplates = [...availabilityTemplates, newTemplate];
    setAvailabilityTemplates(updatedTemplates);
    
    // Here you would also save the templates to the backend
    setIsTemplateModalOpen(false);
  };

  // Handle loading a template
  const handleLoadTemplate = (templateId: string) => {
    const template = availabilityTemplates.find(t => t.id === templateId);
    if (template) {
      // Confirm if there are pending changes
      if (pendingChanges) {
        if (confirm("هناك تغييرات غير محفوظة. هل تريد تحميل القالب بدلاً من ذلك؟")) {
          setAvailabilities([...template.slots]);
          setPendingChanges(false);
        }
      } else {
        setAvailabilities([...template.slots]);
      }
    }
  };

  // Generate time labels for the calendar
  const getTimeLabels = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return hours;
  };

  const renderWeekView = () => {
    const dates = getDatesForCurrentView();
    const timeLabels = getTimeLabels();
    
    return (
      <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
        <div className="min-w-[800px]">
          {/* Header with days */}
          <div className="grid grid-cols-8 gap-1 mb-1">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-center"></div>
            {dates.map((date, index) => (
              <div 
                key={index} 
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-center"
              >
                <div className="font-bold">{DAY_NAMES[getDay(date)]}</div>
                <div className="text-sm">{format(date, 'd MMM', { locale: ar })}</div>
              </div>
            ))}
          </div>
          
          {/* Time grid */}
          {timeLabels.map((time, timeIndex) => (
            <div key={timeIndex} className="grid grid-cols-8 gap-1 mb-1">
              {/* Time label */}
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-center flex items-center justify-center">
                <span className="font-mono">{time}</span>
              </div>
              
              {/* Cells for each day */}
              {dates.map((date, dateIndex) => {
                const dayOfWeek = getDay(date);
                const slot = getSlotForDayAndTime(dayOfWeek, time);
                const isAvailable = !!slot && slot.isAvailable;
                
                return (
                  <div 
                    key={dateIndex} 
                    className={`p-1 rounded-md border border-gray-200 dark:border-gray-700 cursor-pointer transition-colors
                      ${isAvailable ? 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/50' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    onClick={() => {
                      if (slot) {
                        setEditingSlot(slot);
                        setIsEditModalOpen(true);
                      } else {
                        handleAddSlot(dayOfWeek, parseInt(time.split(':')[0]));
                      }
                    }}
                  >
                    {slot && (
                      <div className="text-xs">
                        <div className="flex justify-between items-center">
                          <span>{slot.startTime} - {slot.endTime}</span>
                          {slot.slotType === "group" && (
                            <Badge variant="secondary">جماعية</Badge>
                          )}
                        </div>
                        {slot.note && <div className="mt-1 text-gray-600 dark:text-gray-400 truncate">{slot.note}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render list view (grouped by day)
  const renderListView = () => {
    // Group slots by day
    const slotsByDay: { [key: number]: TimeSlot[] } = {};
    for (let i = 0; i < 7; i++) {
      slotsByDay[i] = availabilities.filter(slot => slot.dayOfWeek === i);
    }
    
    return (
      <div className="space-y-6">
        {DAY_NAMES.map((dayName, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{dayName}</h3>
              <Button 
                size="sm" 
                onClick={() => {
                  const now = new Date();
                  const hour = now.getHours();
                  handleAddSlot(index, hour);
                }}
              >
                <FaPlus className="ml-2" />
                <span>إضافة وقت</span>
              </Button>
            </div>
            
            {slotsByDay[index].length === 0 ? (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                لا توجد أوقات متاحة لهذا اليوم
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {slotsByDay[index].map((slot, slotIndex) => (
                  <div 
                    key={slotIndex} 
                    className="p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setEditingSlot(slot);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FaRegClock className="ml-2 text-gray-500 dark:text-gray-400" />
                        <span>{slot.startTime} - {slot.endTime}</span>
                      </div>
                      {slot.slotType === "group" && (
                        <Badge variant="secondary">جماعية ({slot.maxParticipants})</Badge>
                      )}
                    </div>
                    
                    {slot.recurrence && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>يتكرر: </span>
                        {slot.recurrence === "weekly" && "أسبوعيًا"}
                        {slot.recurrence === "biweekly" && "كل أسبوعين"}
                        {slot.recurrence === "monthly" && "شهريًا"}
                      </div>
                    )}
                    
                    {slot.note && <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{slot.note}</div>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  const renderSlotEditModal = () => {
    if (!isEditModalOpen) return null;
    
    // Generate time options
    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        timeOptions.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {editingSlot?.id ? "تعديل وقت التدريس" : "إضافة وقت تدريس جديد"}
            </h2>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingSlot(null);
              }}
            >
              <FaTimes />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">اليوم</label>
              <select 
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                value={slotForm.dayOfWeek}
                onChange={e => setSlotForm({...slotForm, dayOfWeek: parseInt(e.target.value)})}
              >
                {DAY_NAMES.map((day, index) => (
                  <option key={index} value={index}>{day}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">وقت البدء</label>
                <select 
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  value={slotForm.startTime}
                  onChange={e => setSlotForm({...slotForm, startTime: e.target.value})}
                >
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">وقت الانتهاء</label>
                <select 
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  value={slotForm.endTime}
                  onChange={e => setSlotForm({...slotForm, endTime: e.target.value})}
                >
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">نوع الحصة</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="slotType" 
                    checked={slotForm.slotType === "private"} 
                    onChange={() => setSlotForm({...slotForm, slotType: "private", maxParticipants: 1})}
                    className="ml-2"
                  />
                  <span>فردية</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="slotType" 
                    checked={slotForm.slotType === "group"} 
                    onChange={() => setSlotForm({...slotForm, slotType: "group"})}
                    className="ml-2"
                  />
                  <span>جماعية</span>
                </label>
              </div>
            </div>
            
            {slotForm.slotType === "group" && (
              <div>
                <label className="block text-sm font-medium mb-1">الحد الأقصى للمشاركين</label>
                <input 
                  type="number" 
                  min="2" 
                  max="20" 
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  value={slotForm.maxParticipants}
                  onChange={e => setSlotForm({...slotForm, maxParticipants: parseInt(e.target.value)})}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">مدة الحصة (بالدقائق)</label>
              <select 
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                value={slotForm.duration}
                onChange={e => setSlotForm({...slotForm, duration: parseInt(e.target.value)})}
              >
                <option value="30">30 دقيقة</option>
                <option value="45">45 دقيقة</option>
                <option value="60">ساعة واحدة</option>
                <option value="90">ساعة ونصف</option>
                <option value="120">ساعتان</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">التكرار</label>
              <select 
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                value={slotForm.recurrence || ""}
                onChange={e => setSlotForm({
                  ...slotForm, 
                  recurrence: e.target.value ? e.target.value as "weekly" | "biweekly" | "monthly" : undefined
                })}
              >
                <option value="">لا يتكرر</option>
                <option value="weekly">أسبوعيًا</option>
                <option value="biweekly">كل أسبوعين</option>
                <option value="monthly">شهريًا</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">ملاحظات (اختياري)</label>
              <textarea 
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                value={slotForm.note}
                onChange={e => setSlotForm({...slotForm, note: e.target.value})}
                rows={2}
                maxLength={100}
                placeholder="مثال: حصة مخصصة للمبتدئين"
              />
            </div>
            
            <div className="flex justify-between pt-4">
              {editingSlot?.id && (
                <Button 
                  variant="danger" 
                  onClick={() => handleDeleteSlot(editingSlot.id || "")}
                >
                  <FaTrash className="ml-2" />
                  حذف
                </Button>
              )}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingSlot(null);
                  }}
                >
                  إلغاء
                </Button>
                <Button 
                  onClick={() => {
                    const updatedSlot = {
                      ...slotForm,
                      id: editingSlot?.id
                    };
                    handleSaveSlot(updatedSlot);
                  }}
                >
                  <FaSave className="ml-2" />
                  حفظ
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderBulkEditModal = () => {
    // Implementation for bulk time slot creation
    if (!isBulkEditModalOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">إضافة أوقات متعددة</h2>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsBulkEditModalOpen(false)}
            >
              <FaTimes />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">الأيام</label>
              <div className="grid grid-cols-7 gap-1">
                {DAY_NAMES.map((day, index) => (
                  <label 
                    key={index} 
                    className={`text-center p-2 rounded-md cursor-pointer ${
                      bulkForm.days.includes(index) 
                        ? "bg-primary-100 dark:bg-primary-900/30 border-primary-500 border-2" 
                        : "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={bulkForm.days.includes(index)}
                      onChange={() => {
                        const newDays = bulkForm.days.includes(index)
                          ? bulkForm.days.filter(d => d !== index)
                          : [...bulkForm.days, index];
                        setBulkForm({...bulkForm, days: newDays});
                      }}
                    />
                    <div className="text-xs font-medium">{day}</div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">وقت البدء</label>
                <input 
                  type="time" 
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  value={bulkForm.startTime}
                  onChange={e => setBulkForm({...bulkForm, startTime: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">وقت الانتهاء</label>
                <input 
                  type="time" 
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  value={bulkForm.endTime}
                  onChange={e => setBulkForm({...bulkForm, endTime: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">نوع الحصة</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="bulkSlotType" 
                    checked={bulkForm.slotType === "private"} 
                    onChange={() => setBulkForm({...bulkForm, slotType: "private", maxParticipants: 1})}
                    className="ml-2"
                  />
                  <span>فردية</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="bulkSlotType" 
                    checked={bulkForm.slotType === "group"} 
                    onChange={() => setBulkForm({...bulkForm, slotType: "group"})}
                    className="ml-2"
                  />
                  <span>جماعية</span>
                </label>
              </div>
            </div>
            
            {bulkForm.slotType === "group" && (
              <div>
                <label className="block text-sm font-medium mb-1">الحد الأقصى للمشاركين</label>
                <input 
                  type="number" 
                  min="2" 
                  max="20" 
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  value={bulkForm.maxParticipants}
                  onChange={e => setBulkForm({...bulkForm, maxParticipants: parseInt(e.target.value)})}
                />
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsBulkEditModalOpen(false)}
                className="ml-2"
              >
                إلغاء
              </Button>
              <Button 
                onClick={() => handleBulkEdit(bulkForm)}
              >
                <FaPlus className="ml-2" />
                إضافة
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderTemplateModal = () => {
    if (!isTemplateModalOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">حفظ القالب الحالي</h2>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsTemplateModalOpen(false)}
            >
              <FaTimes />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم القالب</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                value={templateName}
                onChange={e => setTemplateName(e.target.value)}
                placeholder="مثال: جدول الشتاء، جدول رمضان"
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsTemplateModalOpen(false)}
                className="ml-2"
              >
                إلغاء
              </Button>
              <Button 
                onClick={() => handleSaveTemplate(templateName)}
                disabled={!templateName.trim()}
              >
                <FaSave className="ml-2" />
                حفظ القالب
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-md" dir="rtl">
        خطأ: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white" dir="rtl">إدارة الجدول الزمني</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant={currentView === "week" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setCurrentView("week")}
          >
            <FaCalendarWeek className="ml-2" />
            أسبوعي
          </Button>
          <Button 
            variant={currentView === "list" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setCurrentView("list")}
          >
            <FaRegCalendarAlt className="ml-2" />
            قائمة
          </Button>
        </div>
      </div>
      
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-md" dir="rtl">
          {successMessage}
        </div>
      )}
      
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={navigatePrevious}
            >
              <FaChevronRight />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={navigateToday}
            >
              اليوم
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={navigateNext}
            >
              <FaChevronLeft />
            </Button>
            
            <span className="font-medium mx-2">
              {currentView === "week" 
                ? `أسبوع ${format(currentDate, 'd MMM', { locale: ar })}` 
                : `${format(currentDate, 'MMMM yyyy', { locale: ar })}`}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm"
              variant="outline"
              onClick={() => setIsBulkEditModalOpen(true)}
            >
              <FaRegClone className="ml-2" />
              <span>إضافة متعددة</span>
            </Button>
            
            <div className="relative">
              <Button 
                size="sm"
                variant="outline"
                onClick={() => {
                  if (availabilityTemplates.length > 0) {
                    setSelectedTemplate(availabilityTemplates[0].id);
                  } else {
                    setIsTemplateModalOpen(true);
                  }
                }}
              >
                <FaCopy className="ml-2" />
                <span>القوالب</span>
              </Button>
              
              {availabilityTemplates.length > 0 && selectedTemplate && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                  <div className="py-1">
                    <button 
                      className="block w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsTemplateModalOpen(true)}
                    >
                      حفظ القالب الحالي
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    {availabilityTemplates.map(template => (
                      <button 
                        key={template.id}
                        className="block w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleLoadTemplate(template.id)}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          {currentView === "week" && renderWeekView()}
          {currentView === "list" && renderListView()}
        </div>
        
        <div className="flex justify-end mt-4">
          <Button
            onClick={() => handleSaveAvailability(availabilities)}
            disabled={isSaving || !pendingChanges}
            className="flex items-center"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent ml-2"></div>
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
      </Card>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4" dir="rtl">نصائح لإعداد جدولك</h2>
        <div className="space-y-3 text-gray-600 dark:text-gray-400" dir="rtl">
          <p>• حدد ساعات ثابتة كل يوم لتسهيل تذكر الطلاب لمواعيدك.</p>
          <p>• فكر في إضافة بعض الساعات المسائية أو خلال عطلة نهاية الأسبوع لاستيعاب الطلاب ذوي الالتزامات النهارية.</p>
          <p>• استخدم ميزة الحصص الجماعية للسماح بتسجيل عدة طلاب في نفس الوقت للدروس المشتركة.</p>
          <p>• يمكنك إنشاء قوالب مختلفة للجداول الزمنية (مثل جدول أيام الدراسة وجدول العطلات) للتبديل بينها بسهولة.</p>
          <p>• يمكنك دائمًا تحديث جدولك حسب الحاجة، ولكن حاول إخطار الطلاب مسبقًا بأي تغييرات.</p>
          <p>• إذا كنت بحاجة إلى أخذ استراحة من التدريس، استخدم ميزة "إيقاف الحجوزات" في لوحة التحكم بدلاً من إزالة جميع الساعات المتاحة.</p>
        </div>
      </Card>
      
      {/* Render modals */}
      {renderSlotEditModal()}
      {renderBulkEditModal()}
      {renderTemplateModal()}
    </div>
  );
}
