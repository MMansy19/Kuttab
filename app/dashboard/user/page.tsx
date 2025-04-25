import React from 'react';

export default function UserDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 rtl">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">لوحة تحكم الطالب</h2>
        <ul className="space-y-2">
          <li>مرحباً بك في منصة كتاب!</li>
          <li>يمكنك استعراض المعلمين وحجز المواعيد.</li>
        </ul>
      </div>
    </div>
  );
}
