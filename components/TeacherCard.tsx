"use client";

import type { Teacher } from '../types';
import React from 'react';

interface TeacherCardProps {
  teacher: Teacher;
  onBook?: (id: string) => void;
}

export default function TeacherCard({ teacher, onBook }: TeacherCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col gap-3 items-start w-full max-w-sm mx-auto transition-colors duration-300">
      <div className="flex items-center gap-3 w-full">
        <img
          src={teacher.avatarUrl || '/avatar-placeholder.png'}
          alt={teacher.name}
          className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-700 object-cover"
        />
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{teacher.name}</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">{teacher.subjects.join('، ')}</div>
        </div>
      </div>
      <div className="text-gray-700 dark:text-gray-300 text-right w-full">{teacher.bio}</div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-yellow-500 dark:text-yellow-400">★ {teacher.rating.toFixed(1)}</span>
      </div>
      {onBook && (
        <button
          className="mt-3 px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 rounded text-white font-bold w-full transition-colors duration-300"
          onClick={() => onBook(teacher.id)}
        >
          احجز مع المعلم
        </button>
      )}
    </div>
  );
}