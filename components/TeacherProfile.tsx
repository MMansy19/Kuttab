import type { Teacher } from '../../../types';
import React from 'react';

interface TeacherProfileProps {
  teacher: Teacher;
}

export default function TeacherProfile({ teacher }: TeacherProfileProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-8 max-w-2xl mx-auto flex flex-col gap-4 mt-8">
      <div className="flex items-center gap-6">
        <img
          src={teacher.avatarUrl || '/avatar-placeholder.png'}
          alt={teacher.name}
          className="w-24 h-24 rounded-full border-2 border-gray-700 object-cover"
        />
        <div>
          <h2 className="text-3xl font-bold mb-1">{teacher.name}</h2>
          <div className="text-lg text-gray-400 mb-1">{teacher.subjects.join('، ')}</div>
          <div className="text-yellow-400">★ {teacher.rating.toFixed(1)}</div>
        </div>
      </div>
      <div className="text-gray-300 text-right leading-loose">{teacher.bio}</div>
      <div className="mt-4">
        <span className="font-semibold">الأوقات المتاحة:</span>
        <ul className="list-disc pr-6 mt-2 text-gray-200">
          {teacher.availableSlots.length === 0 ? (
            <li>لا يوجد أوقات متاحة حالياً</li>
          ) : (
            teacher.availableSlots.map(slot => <li key={slot}>{slot}</li>)
          )}
        </ul>
      </div>
    </div>
  );
}