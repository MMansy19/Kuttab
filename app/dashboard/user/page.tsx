import React from 'react';
import type { Booking } from '../../../types';

const mockBookings: Booking[] = [
  {
    id: 'b1',
    userId: 'u1',
    teacherId: '1',
    date: '2025-04-28',
    time: '18:00',
    status: 'confirmed',
  },
  {
    id: 'b2',
    userId: 'u1',
    teacherId: '2',
    date: '2025-05-01',
    time: '17:00',
    status: 'pending',
  },
];

export default function BookingsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">الحجوزات الخاصة بك</h2>
      <ul className="flex flex-col gap-4">
        {mockBookings.map(b => (
          <li key={b.id} className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <div>تاريخ الجلسة: <span className="font-semibold">{b.date}</span></div>
              <div>الوقت: <span className="font-semibold">{b.time}</span></div>
            </div>
            <div className="text-sm">
              الحالة: <span className={
                b.status === 'confirmed' ? 'text-green-400' : b.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
              }>{b.status === 'confirmed' ? 'مؤكد' : b.status === 'pending' ? 'قيد الانتظار' : 'ملغي'}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
