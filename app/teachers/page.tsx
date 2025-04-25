"use client";

import type { Teacher } from '../../types';
import TeacherCard from '../../components/TeacherCard';
import React from 'react';

const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'أ. محمد علي',
    bio: 'معلم رياضيات بخبرة 10 سنوات في تدريس المرحلة الثانوية.',
    subjects: ['رياضيات'],
    rating: 4.8,
    avatarUrl: '',
    availableSlots: [],
  },
  {
    id: '2',
    name: 'أ. فاطمة الزهراء',
    bio: 'متخصصة في اللغة العربية وآدابها لجميع المراحل.',
    subjects: ['اللغة العربية'],
    rating: 4.9,
    avatarUrl: '',
    availableSlots: [],
  },
];

export default function TeachersPage() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 py-8 px-2 sm:px-4">
      {mockTeachers.map(teacher => (
        <TeacherCard key={teacher.id} teacher={teacher} onBook={() => {}} />
      ))}
    </div>
  );
}