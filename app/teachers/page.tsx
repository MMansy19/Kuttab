"use client";

import type { Teacher } from '../../types';
import TeacherCard from '../../components/TeacherCard';
import React, { useState, useMemo } from 'react';
import teachersData from '../../data/teachers';
import { FaFilter } from 'react-icons/fa';

export default function TeachersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    isPaid: 'all',
    minRating: 0,
    subject: 'all',
    experience: 0,
    gender: 'all',
  });
  const [teachers] = useState<Teacher[]>(teachersData);

  // Filtering logic
  const filteredTeachers = useMemo(() => {
    let result = teachers;
    if (filter.isPaid !== 'all') {
      result = result.filter(t => t.isPaid === (filter.isPaid === 'paid'));
    }
    if (filter.minRating > 0) {
      result = result.filter(t => t.rating >= filter.minRating);
    }
    if (filter.subject !== 'all') {
      result = result.filter(t => t.subjects.includes(filter.subject));
    }
    if (filter.experience > 0) {
      result = result.filter(t => t.experience >= filter.experience);
    }
    if (filter.gender !== 'all') {
      result = result.filter(t => t.gender === filter.gender);
    }
    if (search.trim()) {
      result = result.filter(t => t.name.includes(search));
    }
    return result;
  }, [teachers, filter, search]);

  const handleBookTeacher = (teacherId: string) => {
    console.log(`Booking teacher with ID: ${teacherId}`);
    // Implement booking logic here
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 py-8 px-2 sm:px-4">
      {/* Sidebar Filter */}
      <aside className="w-full md:w-64 mb-4 md:mb-0 md:mr-6 flex-shrink-0">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col gap-4 sticky top-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <FaFilter className="text-emerald-700" />
            <span className="font-bold text-gray-900 dark:text-white">تصفية المعلمين</span>
          </div>
          <select
            className="rounded border px-2 py-1"
            value={filter.isPaid}
            onChange={e => setFilter(f => ({ ...f, isPaid: e.target.value }))}
          >
            <option value="all">الكل (مجاني/مدفوع)</option>
            <option value="paid">مدفوع</option>
            <option value="free">مجاني</option>
          </select>
          <select
            className="rounded border px-2 py-1"
            value={filter.subject}
            onChange={e => setFilter(f => ({ ...f, subject: e.target.value }))}
          >
            <option value="all">كل المواد</option>
            {Array.from(new Set(teachers.flatMap(t => t.subjects))).map(subj => (
              <option key={subj} value={subj}>{subj}</option>
            ))}
          </select>
          <select
            className="rounded border px-2 py-1"
            value={filter.gender}
            onChange={e => setFilter(f => ({ ...f, gender: e.target.value }))}
          >
            <option value="all">الجميع</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
          <input
            type="number"
            min={0}
            className="rounded border px-2 py-1 w-full"
            placeholder="الخبرة (سنوات)"
            value={filter.experience}
            onChange={e => setFilter(f => ({ ...f, experience: Number(e.target.value) }))}
          />
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            className="rounded border px-2 py-1 w-full"
            placeholder="التقييم (0-5)"
            value={filter.minRating}
            onChange={e => setFilter(f => ({ ...f, minRating: Number(e.target.value) }))}
          />
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1">
        {/* Search by name on top */}
        <div className="mb-6 w-full max-w-lg mx-auto">
          <input
            className="rounded border px-3 py-2 w-full text-right"
            placeholder="ابحث باسم المعلم..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            dir="rtl"
          />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeachers.length === 0 ? (
            <div className="col-span-full text-center text-red-500">لا يوجد معلمين مطابقين للبحث/التصفية</div>
          ) : (
            filteredTeachers.map((teacher: Teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onBook={() => handleBookTeacher(teacher.id)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
