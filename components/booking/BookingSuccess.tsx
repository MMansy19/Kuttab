"use client";

import React from 'react';
import { FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import Link from 'next/link';
import { SlotType } from '../AvailabilityCalendar';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

interface BookingSuccessProps {
  bookingId: string;
  teacherName: string;
  selectedSlot: SlotType;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({
  bookingId,
  teacherName,
  selectedSlot,
}) => {
  const startTime = parseISO(selectedSlot.startTime);
  const endTime = parseISO(selectedSlot.endTime);
  
  const formattedDate = format(startTime, 'EEEE d MMMM yyyy', { locale: ar });
  const formattedStartTime = format(startTime, 'h:mm a', { locale: ar });
  const formattedEndTime = format(endTime, 'h:mm a', { locale: ar });
  
  return (
    <Card className="w-full max-w-lg mx-auto p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <FaCheckCircle className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
          تم تأكيد الحجز بنجاح
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          تم حجز موعد مع الأستاذ <span className="font-bold">{teacherName}</span>
        </p>
        
        <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg w-full">
          <div className="flex items-center gap-2 mb-2">
            <FaCalendarAlt className="text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold">تفاصيل الموعد:</span>
          </div>
          <div className="text-gray-700 dark:text-gray-300 text-right">
            <p className="mb-1">اليوم والتاريخ: {formattedDate}</p>
            <p className="mb-1">وقت البدء: {formattedStartTime}</p>
            <p className="mb-1">وقت الانتهاء: {formattedEndTime}</p>
            <p className="mt-2 font-medium">رقم الحجز: {bookingId}</p>
          </div>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm my-4">
          تم إرسال تفاصيل الحجز إلى بريدك الإلكتروني
        </p>
        
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/dashboard/bookings">
            <Button variant="default">
              عرض الحجوزات
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default BookingSuccess;
