import type { Teacher } from '../../../types';
import React from 'react';

interface TeacherProfileProps {
  teacher: Teacher & {
    experience?: number;
    isPaid?: boolean;
    price?: number;
    videoUrl?: string;
  };
}

export default function TeacherProfile({ teacher }: TeacherProfileProps) {
  return (
    <div className="bg-gray-800 dark:bg-gray-900 rounded-lg shadow-md p-8 max-w-2xl mx-auto flex flex-col gap-4 mt-8">
      <div className="flex items-center gap-6">
        <img
          src={teacher.avatarUrl || '/avatar-placeholder.png'}
          alt={teacher.name}
          className="w-24 h-24 rounded-full border-2 border-gray-700 object-cover"
        />
        <div>
          <h2 className="text-3xl font-bold mb-1 text-white">{teacher.name}</h2>
          <div className="text-lg text-gray-400 mb-1">{teacher.subjects?.join('، ')}</div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">★ {teacher.rating?.toFixed(1) ?? '0.0'}</span>
            <span className="text-gray-400">({teacher.rating ? Math.round(teacher.rating) : 0}/5)</span>
          </div>
          {teacher.experience !== undefined && (
            <div className="text-sm text-gray-300 mt-1">الخبرة: {teacher.experience} سنة</div>
          )}
        </div>
      </div>
      <div className="text-gray-300 text-right leading-loose">{teacher.bio}</div>
      <div className="flex flex-wrap gap-4 mt-2">
        <div className="px-4 py-2 rounded bg-gray-700 text-white">
          النوع: {teacher.isPaid ? 'مدفوع' : 'مجاني'}
        </div>
        {teacher.isPaid && teacher.price !== undefined && (
          <div className="px-4 py-2 rounded bg-blue-700 text-white">
            السعر: {teacher.price} ريال/ساعة
          </div>
        )}
      </div>
      <div className="mt-4">
        <span className="font-semibold">الأوقات المتاحة:</span>
        <ul className="list-disc pr-6 mt-2 text-gray-200">
          {teacher.availableSlots?.length === 0 ? (
            <li>لا يوجد أوقات متاحة حالياً</li>
          ) : (
            teacher.availableSlots?.map(slot => <li key={slot}>{slot}</li>)
          )}
        </ul>
      </div>
      {teacher.videoUrl ? (
        <div className="mt-6">
          <span className="font-semibold text-white">فيديو تعريفي:</span>
          <video controls className="w-full mt-2 rounded shadow">
            <source src={teacher.videoUrl} type="video/mp4" />
            متصفحك لا يدعم تشغيل الفيديو.
          </video>
        </div>
      ) : (
        <div className="mt-6 text-gray-400 text-center">لا يوجد فيديو تعريفي</div>
      )}
    </div>
  );
}