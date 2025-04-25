"use client";

import type { Teacher } from '../types';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';

interface TeacherCardProps {
  teacher: Teacher;
  onBook?: (id: string) => void;
}

export default function TeacherCard({ teacher, onBook }: TeacherCardProps) {
  const router = useRouter();
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if the book button is clicked
    if ((e.target as HTMLElement).closest('button')) return;
    router.push(`/teachers/${teacher.id}`);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-lg p-6 flex flex-col gap-3 items-start w-full max-w-sm mx-auto transition-colors duration-300 cursor-pointer hover:shadow-xl border border-gray-200 dark:border-gray-700"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`عرض ملف ${teacher.name}`}
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
          <p className="text-emerald-700 dark:text-emerald-300 text-sm">{teacher.experience} سنوات خبرة</p>
        </div>
      </div>
      <p className="mt-2">{teacher.bio}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {teacher.tags?.map(tag => (
          <span key={tag} className="px-3 py-1 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">{tag}</span>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-yellow-500 dark:text-yellow-400 font-bold">★ {teacher.rating?.toFixed(1) ?? '0.0'}</span>
      </div>
      <button
        className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-700 focus:bg-emerald-700 text-white font-semibold mt-2 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        onClick={e => { e.stopPropagation(); onBook && onBook(teacher.id); }}
      >
        احجز مع المعلم
      </button>
    </div>
  );
}