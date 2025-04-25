import React from 'react';

export default function BookTeacherPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form className="w-full max-w-md p-8 bg-white rounded shadow-md space-y-4 rtl">
        <h2 className="text-2xl font-bold text-center">حجز موعد مع معلم</h2>
        <input className="input input-bordered w-full" name="date" type="date" required />
        <input className="input input-bordered w-full" name="timeSlot" type="text" placeholder="الوقت (مثال: 10:00-11:00)" required />
        <button className="btn btn-primary w-full" type="submit">حجز</button>
      </form>
    </div>
  );
}
