import React from 'react';

export default function TeacherDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 rounded shadow-md w-full max-w-lg mx-2 sm:mx-0 transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">لوحة تحكم المعلم</h2>
        <ul className="space-y-2 text-gray-800 dark:text-gray-200 text-center text-base sm:text-lg">
          <li>مرحباً بك في منصة كُـــتَّـــاب | KOTTAB!</li>
          <li>يمكنك تحديد أوقات التوفر ومتابعة الحجوزات.</li>
        </ul>
      </div>
    </div>
  );
}
