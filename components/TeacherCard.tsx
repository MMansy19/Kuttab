"use client";

import type { Teacher } from '../types';
import React from 'react';
import { useRouter } from 'next/navigation';

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
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col gap-3 items-start w-full max-w-sm mx-auto transition-colors duration-300 cursor-pointer hover:shadow-lg"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`عرض ملف ${teacher.name}`}
    >
      <div className="flex items-center gap-4 w-full">
        <img
          src={teacher.avatar || '/avatar-placeholder.png'}
          alt={teacher.name}
          className="w-16 h-16 rounded-full border-2 border-emerald-300 dark:border-emerald-700 object-cover"
        />
        <div>
          <h3 className="text-xl font-bold text-emerald-900 dark:text-white">{teacher.name}</h3>
          <p className="text-emerald-700 dark:text-emerald-300 text-sm">{teacher.experience} سنوات خبرة</p>
        </div>
      </div>
      <p className="text-emerald-900 dark:text-emerald-200 mt-2">{teacher.bio}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {teacher.tags?.map(tag => (
          <span key={tag} className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-xs font-semibold">{tag}</span>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-yellow-500 dark:text-yellow-400">★ {teacher.rating?.toFixed(1) ?? '0.0'}</span>
      </div>
      {onBook && (
        <button
          className="mt-3 px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 rounded text-white font-bold w-full transition-colors duration-300"
          onClick={e => { e.stopPropagation(); onBook(teacher.id); }}
        >
          احجز مع المعلم
        </button>
      )}
    </div>
  );
}