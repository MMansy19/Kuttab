"use client";

import React from 'react';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { SlotType } from '../AvailabilityCalendar';
import { FaCalendarAlt, FaClock, FaUser, FaUserGraduate, FaUsers, FaCommentAlt } from 'react-icons/fa';

interface BookingSummaryProps {
  teacherName: string;
  date: Date | null;
  slot: SlotType | null;
  details: {
    name: string;
    email: string;
    phone: string;
    message: string;
    participantCount: number;
    goal: string;
    level: 'beginner' | 'intermediate' | 'advanced';
  };
  duration: number;
}

export default function BookingSummary({ 
  teacherName, 
  date, 
  slot, 
  details, 
  duration 
}: BookingSummaryProps) {
  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return format(date, 'eeee d MMMM yyyy', { locale: ar });
  };
  
  // Format time for display
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = parseISO(dateString);
      return format(date, 'h:mm a', { locale: ar });
    } catch (error) {
      return '';
    }
  };
  
  // Get level label
  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'مبتدئ';
      case 'intermediate': return 'متوسط';
      case 'advanced': return 'متقدم';
      default: return level;
    }
  };
  
  // Get goal label
  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case 'recitation': return 'تحسين التلاوة';
      case 'memorization': return 'حفظ القرآن';
      case 'tajweed': return 'تعلم التجويد';
      case 'tafsir': return 'تفسير القرآن';
      case 'general': return 'التعليم العام للقرآن';
      default: return goal || 'غير محدد';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Teacher */}
      <div className="flex items-center justify-between">
        <span className="text-gray-600 dark:text-gray-400">المعلم</span>
        <span className="font-medium text-gray-900 dark:text-white">{teacherName}</span>
      </div>
      
      {/* Date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-emerald-500" size={14} />
          <span className="text-gray-600 dark:text-gray-400">التاريخ</span>
        </div>
        <span className="font-medium text-gray-900 dark:text-white">{formatDate(date)}</span>
      </div>
      
      {/* Time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaClock className="text-emerald-500" size={14} />
          <span className="text-gray-600 dark:text-gray-400">الوقت</span>
        </div>
        <span className="font-medium text-gray-900 dark:text-white">
          {slot ? `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}` : ''}
        </span>
      </div>
      
      {/* Duration */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaClock className="text-emerald-500" size={14} />
          <span className="text-gray-600 dark:text-gray-400">المدة</span>
        </div>
        <span className="font-medium text-gray-900 dark:text-white">{duration} دقيقة</span>
      </div>
      
      {/* Session Type */}
      {slot && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {slot.type === 'group' ? (
              <FaUsers className="text-blue-500" size={14} />
            ) : (
              <FaUser className="text-emerald-500" size={14} />
            )}
            <span className="text-gray-600 dark:text-gray-400">نوع الجلسة</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">
            {slot.type === 'group' ? 'جلسة جماعية' : 'جلسة خاصة'}
          </span>
        </div>
      )}
      
      {/* Participants Count */}
      {slot?.type === 'group' && details.participantCount > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaUsers className="text-blue-500" size={14} />
            <span className="text-gray-600 dark:text-gray-400">عدد المشاركين</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">
            {details.participantCount} مشاركين
          </span>
        </div>
      )}
      
      {/* Student Name */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaUser className="text-emerald-500" size={14} />
          <span className="text-gray-600 dark:text-gray-400">اسم الطالب</span>
        </div>
        <span className="font-medium text-gray-900 dark:text-white">{details.name}</span>
      </div>
      
      {/* Email */}
      <div className="flex items-center justify-between">
        <span className="text-gray-600 dark:text-gray-400">البريد الإلكتروني</span>
        <span className="font-medium text-gray-900 dark:text-white dir-ltr">{details.email}</span>
      </div>
      
      {/* Level */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaUserGraduate className="text-emerald-500" size={14} />
          <span className="text-gray-600 dark:text-gray-400">المستوى</span>
        </div>
        <span className="font-medium text-gray-900 dark:text-white">{getLevelLabel(details.level)}</span>
      </div>
      
      {/* Goal */}
      {details.goal && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaUserGraduate className="text-emerald-500" size={14} />
            <span className="text-gray-600 dark:text-gray-400">الهدف</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{getGoalLabel(details.goal)}</span>
        </div>
      )}
      
      {/* Message */}
      {details.message && (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FaCommentAlt className="text-emerald-500" size={14} />
            <span className="text-gray-600 dark:text-gray-400">رسالة</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md text-right">
            {details.message}
          </p>
        </div>
      )}
    </div>
  );
}
