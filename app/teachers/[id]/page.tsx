"use client";

import type { Teacher } from '../../../types';
import TeacherProfile from '../../../components/TeacherProfile';
import teachersData from '../../../data/teachers';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function TeacherProfilePage() {
  const params = useParams();
  const [teachers] = useState<Teacher[]>(teachersData);

  // Find teacher by id param
  const teacher = teachers.find((t: Teacher) => t.id === params.id);
  if (!teacher) return <div className="text-center text-red-500 mt-8">المعلم غير موجود</div>;

  // Group availableSlots by week (ISO week)
  const slotsByWeek: Record<string, string[]> = {};
  teacher.availableSlots.forEach(slot => {
    const date = new Date(slot.replace(' ', 'T'));
    // Get ISO week string: yyyy-Www
    const week = `${date.getFullYear()}-W${String(
      Math.ceil(((date - new Date(date.getFullYear(),0,1)) / 86400000 + new Date(date.getFullYear(),0,1).getDay()+1) / 7)
    ).padStart(2, '0')}`;
    if (!slotsByWeek[week]) slotsByWeek[week] = [];
    slotsByWeek[week].push(slot);
  });
  const weekKeys = Object.keys(slotsByWeek);
  const [selectedWeek, setSelectedWeek] = useState(weekKeys[0] || '');

  return (
    <div className="flex flex-col items-center w-full px-2 py-4">
      <div className="w-full max-w-2xl mb-6">
        <TeacherProfile teacher={teacher} />
      </div>
      <div className="w-full max-w-2xl mt-4">
        <label className="block mb-2 font-bold text-emerald-900 dark:text-emerald-200">اختر الأسبوع لعرض المواعيد المتاحة:</label>
        <select
          className="rounded border px-2 py-1 mb-4 w-full"
          value={selectedWeek}
          onChange={e => setSelectedWeek(e.target.value)}
        >
          {weekKeys.map(week => (
            <option key={week} value={week}>{week}</option>
          ))}
        </select>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {slotsByWeek[selectedWeek]?.length ? (
            slotsByWeek[selectedWeek].map(slot => (
              <div key={slot} className="bg-emerald-100 dark:bg-emerald-900 rounded p-3 text-center text-emerald-900 dark:text-emerald-200 font-semibold">
                {slot}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-red-500">لا يوجد مواعيد متاحة لهذا الأسبوع</div>
          )}
        </div>
      </div>
    </div>
  );
}