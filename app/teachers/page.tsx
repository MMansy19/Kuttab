"use client";

import type { Teacher } from '../../types';
import TeacherCard from '../../components/TeacherCard';
import React, { useState } from 'react';
import teachersData from '../../data/teachers.ts';
  
export default function TeachersPage() {
  const [teachers] = useState(teachersData);
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 py-8 px-2 sm:px-4">
      {teachers.map((teacher: Teacher) => (
        <TeacherCard key={teacher.id} teacher={teacher} onBook={() => {}} />
      ))}
    </div>
  );
}