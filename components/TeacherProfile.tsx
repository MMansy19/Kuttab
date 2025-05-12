import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import type { Teacher } from '../types';

interface TeacherProfileProps {
  teacher: Teacher & {
    experience?: number;
    isPaid?: boolean;
    price?: number;
    videoUrl?: string;
  };
}

const TeacherAvatar: React.FC<{ avatarUrl?: string; name: string }> = ({ avatarUrl, name }) => (
  avatarUrl ? (
    <img
      src={avatarUrl}
      alt={name}
      className="w-24 h-24 rounded-full border-2 border-emerald-300 dark:border-emerald-700 object-cover bg-gray-100 dark:bg-gray-900"
    />
  ) : (
    <FaUserCircle className="w-24 h-24 text-gray-400" />
  )
);

const TeacherProfile: React.FC<TeacherProfileProps> = ({ teacher }) => {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-lg p-8 flex flex-col gap-4 transition-colors duration-300 max-w-2xl mx-auto mt-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-6 mb-4 relative">
        <TeacherAvatar avatarUrl={teacher.avatarUrl} name={teacher.name} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{teacher.name}</h2>
          <div className="text-lg text-emerald-700 dark:text-emerald-300 mb-1">{teacher.subjects?.join('، ')}</div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 dark:text-yellow-400">★ {teacher.rating?.toFixed(1) ?? '0.0'}</span>
            <span className="text-gray-500 dark:text-gray-400">({teacher.rating ? Math.round(teacher.rating) : 0}/5)</span>
          </div>
          {teacher.experience !== undefined && (
            <div className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">الخبرة: {teacher.experience} سنة</div>
          )}
        </div>
      </div>
      <div className="text-gray-800 dark:text-emerald-200 text-right leading-loose">{teacher.bio}</div>
      <div className="flex flex-wrap gap-4 mt-2">
        <div className="px-4 py-2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
          النوع: {teacher.isPaid ? 'مدفوع' : 'مجاني'}
        </div>
        {teacher.isPaid && teacher.price !== undefined && (
          <div className="px-4 py-2 rounded bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white">
            السعر: {teacher.price} ريال/ساعة
          </div>
        )}
      </div>
      <div className="mt-4">
        <span className="font-semibold text-emerald-900 dark:text-emerald-200">الأوقات المتاحة:</span>
        <ul className="list-disc pr-6 mt-2 text-gray-800 dark:text-emerald-200">
          {teacher.availableSlots?.length === 0 ? (
            <li>لا يوجد أوقات متاحة حالياً</li>
          ) : (
            teacher.availableSlots?.map(slot => <li key={slot}>{slot}</li>)
          )}
        </ul>
      </div>
      {teacher.videoUrl ? (
        <div className="mt-6">
          <span className="font-semibold text-emerald-900 dark:text-emerald-200">فيديو تعريفي:</span>
          <video controls className="w-full mt-2 rounded shadow">
            <source src={teacher.videoUrl} type="video/mp4" />
            متصفحك لا يدعم تشغيل الفيديو.
          </video>
        </div>
      ) : (
        <div className="mt-6 text-gray-500 dark:text-gray-400">لا يوجد فيديو تعريفي</div>
      )}
    </div>
  );
};

export default TeacherProfile;