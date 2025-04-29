"use client";
import type { Teacher } from '../types';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaEye, FaCalendarCheck, FaStar, FaQuran, FaUserGraduate } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

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
          <div className="w-16 h-16 rounded-full border-2 border-emerald-300 dark:border-emerald-700 overflow-hidden">
            <Image
              src={teacher.avatarUrl}
              alt={teacher.name}
              width={64}
              height={64}
              className="object-cover bg-gray-100 dark:bg-gray-900"
            />
          </div>
        ) : (
          <FaUserCircle className="w-16 h-16 text-gray-400" />
        )}
        <div>
          <h3 className="text-xl font-bold">{teacher.name}</h3>
          <div className="flex items-center gap-3">
            <p className="text-emerald-700 dark:text-emerald-300 text-sm mt-[2px]">{teacher.experience} سنوات خبرة</p>
            <div className="flex items-center text-yellow-500 dark:text-yellow-400">
              <FaStar className="h-4 w-4 ml-1" />
              <span className="font-bold">{teacher.rating?.toFixed(1) ?? '0.0'}</span>
            </div>
          </div>
          {teacher.specialization && (
            <div className="flex items-center mt-1 gap-1 text-blue-600 dark:text-blue-400 text-sm">
              <FaUserGraduate className="h-3 w-3 ml-1" />
              <span>{teacher.specialization}</span>
            </div>
          )}
        </div>
      </div>
      <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
        {teacher.bio}
      </p>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {teacher.subjects?.map(subject => (
          <span key={subject} className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center">
            <FaQuran className="ml-1 h-3 w-3" />
            {subject}
          </span>
        ))}
      </div>
      
      <div className="w-full flex gap-3 mt-auto sm:flex-col flex-row">
        <button
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
        loadingProfile ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
          } focus:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-70`}
          onClick={handleViewProfile}
          disabled={loadingProfile || loadingBooking}
        >
          {loadingProfile ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
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
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
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
      {!teacher.isPaid && (
        <div className="absolute top-2 left-4">
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2.5 py-1 rounded">
            مجاني
          </span>
        </div>
      )}
      
      <Link href={`/book/${teacher.id}`} prefetch={true} className="hidden" />
      <Link href={`/teachers/${teacher.id}`} prefetch={true} className="hidden" />
    </div>
  );
}