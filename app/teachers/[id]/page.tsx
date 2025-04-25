"use client";

import type { Teacher } from '../../../types';
import TeacherProfile from '../../../components/TeacherProfile';
import teachersData from '../../../data/teachers';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function TeacherProfilePage() {
  const params = useParams();
  const [teachers] = useState(teachersData);
  const teacher = teachers.find((t: Teacher) => t.id === params.id);
  if (!teacher) return <div className="text-center text-red-500 mt-8">المعلم غير موجود</div>;
  return <TeacherProfile teacher={teacher} />;
}