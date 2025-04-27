"use client";

import type { Teacher } from '../types';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaEye, FaCalendarCheck, FaStar } from 'react-icons/fa';
import Link from 'next/link';

interface TeacherCardProps {
  teacher: Teacher;
  onBook?: (id: string) => void;
}

export default function TeacherCard({ teacher, onBook }: TeacherCardProps) {
  const router = useRouter();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);

  const handleViewProfile = () => {
    setLoadingProfile(true);
    router.push(`/teachers/${teacher.id}`);
    // No need to reset loading state as we're navigating away
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingBooking(true);
    
    if (onBook) {
      try {
        onBook(teacher.id);
      } finally {
        setLoadingBooking(false);
      }
    } else {
      router.push(`/book/${teacher.id}`);
      // No need to reset loading state as we're navigating away
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-lg p-6 flex flex-col gap-3 items-start w-full max-w-sm mx-auto transition-colors duration-300 border border-gray-200 dark:border-gray-700 relative hover:shadow-xl"
    >
      <div className="flex items-center gap-4 w-full relative">
        {teacher.avatarUrl ? (
          <img
            src={teacher.avatarUrl}
            alt={teacher.name}
            className="w-16 h-16 rounded-full border-2 border-emerald-300 dark:border-emerald-700 object-cover bg-gray-100 dark:bg-gray-900"
          />
        ) : (
          <FaUserCircle className="w-16 h-16 text-gray-400" />
        )}
        <div>
          <h3 className="text-xl font-bold">{teacher.name}</h3>
          <div className="flex items-center gap-3">
            <p className="text-emerald-700 dark:text-emerald-300 text-sm mt-[2px]">{teacher.experience} سنوات خبرة</p>
            <div className="flex items-center text-yellow-500 dark:text-yellow-400">
              <FaStar className="h-4 w-4 mr-1" />
              <span className="font-bold">{teacher.rating?.toFixed(1) ?? '0.0'}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-gray-700 dark:text-gray-300">{teacher.bio}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {teacher.tags?.map(tag => (
          <span key={tag} className="px-3 py-1 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">{tag}</span>
        ))}
      </div>
      
      <div className="w-full flex gap-3 mt-3 sm:flex-col flex-row lg:flex-col xl:flex-row">
        <button
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
            loadingProfile ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
          } focus:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-70`}
          onClick={handleViewProfile}
          disabled={loadingProfile || loadingBooking}
        >
          {loadingProfile ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              جاري التحميل
            </>
          ) : (
            <>
              <FaEye />
              عرض الملف
            </>
          )}
        </button>
        <button
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
            loadingBooking ? 'bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700'
          } focus:bg-emerald-700 text-white font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-70`}
          onClick={handleBookClick}
          disabled={loadingProfile || loadingBooking}
        >
          {loadingBooking ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              جاري الحجز
            </>
          ) : (
            <>
              <FaCalendarCheck />
              احجز الآن
            </>
          )}
        </button>
      </div>
      
      {teacher.isPaid && (
        <div className="absolute top-2 left-4">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2.5 py-1 rounded">
            {teacher.price} ريال
          </span>
        </div>
      )}
      
      <Link href={`/book/${teacher.id}`} prefetch={true} className="hidden" />
      <Link href={`/teachers/${teacher.id}`} prefetch={true} className="hidden" />
    </div>
  );
}