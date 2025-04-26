'use client';
import React, { useState, useEffect } from 'react';
import TeacherBooking from '@/components/booking/TeacherBooking';
import { useParams } from 'next/navigation';

export default function BookTeacherPage() {
  const params = useParams();
  const teacherId = params.teacherId as string;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <TeacherBooking teacherId={teacherId} />
      )}
    </div>
  );
}
