"use client";

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, addMonths, getDay, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { FaChevronRight, FaChevronLeft, FaRegCalendarAlt } from 'react-icons/fa';
import { cn } from '@/utils/cn';

interface DateSelectorProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date | null;
  availableDates: Date[];
}

export default function DateSelector({ onSelectDate, selectedDate, availableDates }: DateSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [animationDirection, setAnimationDirection] = useState<'right' | 'left'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Generate calendar days when month changes
  useEffect(() => {
    const firstDay = startOfMonth(currentMonth);
    const lastDay = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: firstDay, end: lastDay });
    setCalendarDays(days);
  }, [currentMonth]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setAnimationDirection('right');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentMonth(prevMonth => addMonths(prevMonth, -1));
      setIsAnimating(false);
    }, 200);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setAnimationDirection('left');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
      setIsAnimating(false);
    }, 200);
  };

  // Check if a date is available
  const isDateAvailable = (date: Date): boolean => {
    return availableDates.some(availableDate => isSameDay(availableDate, date));
  };

  // Get weekday names
  const weekDayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  
  // Count available dates in current month
  const availableDatesInMonth = calendarDays.filter(day => isDateAvailable(day)).length;

  return (
    <div className="w-full">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button 
          type="button"
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FaChevronRight className="rtl:rotate-180" />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {format(currentMonth, 'MMMM yyyy', { locale: ar })}
        </h2>
        
        <button 
          type="button"
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FaChevronLeft className="rtl:rotate-180" />
        </button>
      </div>
      
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDayNames.map(day => (
          <div key={day} className="text-center py-2 font-medium text-sm text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className={cn(
        "grid grid-cols-7 gap-1 transition-all duration-200",
        isAnimating && animationDirection === 'left' && "opacity-0 transform translate-x-4",
        isAnimating && animationDirection === 'right' && "opacity-0 transform -translate-x-4"
      )}>
        {/* Empty cells for days of the week before the first day of the month */}
        {Array.from({ length: getDay(startOfMonth(currentMonth)) }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2 h-14"></div>
        ))}
        
        {/* Actual days of the month */}
        {calendarDays.map(day => {
          const isAvailable = isDateAvailable(day);
          const isCurrent = selectedDate && isSameDay(day, selectedDate);
          const isPast = isBefore(day, new Date()) && !isToday(day);
          
          return (
            <button
              key={day.toString()}
              type="button"
              disabled={!isAvailable || isPast}
              onClick={() => isAvailable && !isPast && onSelectDate(day)}
              className={cn(
                "h-14 rounded-lg flex flex-col items-center justify-center relative transition-colors",
                isAvailable && !isPast
                  ? "hover:bg-emerald-50 dark:hover:bg-emerald-900/30 cursor-pointer"
                  : "cursor-not-allowed",
                isCurrent && "bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-500",
                isPast && "text-gray-400 dark:text-gray-600",
                !isAvailable && !isPast && "text-gray-300 dark:text-gray-700"
              )}
            >
              <span className={cn(
                "text-sm font-medium",
                isToday(day) && "bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center",
                isPast && "text-gray-400 dark:text-gray-600"
              )}>
                {format(day, 'd')}
              </span>
              
              {isAvailable && !isPast && (
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute bottom-1"></span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Available dates information */}
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
        <FaRegCalendarAlt className="text-emerald-500" />
        {availableDatesInMonth > 0 ? (
          <span>{availableDatesInMonth} مواعيد متاحة في هذا الشهر</span>
        ) : (
          <span>لا توجد مواعيد متاحة في هذا الشهر</span>
        )}
      </div>
    </div>
  );
}
