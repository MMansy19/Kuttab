import React from 'react';

export default function TeacherAvailabilityPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form className="w-full max-w-md p-8 bg-white rounded shadow-md space-y-4 rtl">
        <h2 className="text-2xl font-bold text-center">تحديد أوقات التوفر</h2>
        <select className="input input-bordered w-full" name="dayOfWeek" required>
          <option value="0">الأحد</option>
          <option value="1">الإثنين</option>
          <option value="2">الثلاثاء</option>
          <option value="3">الأربعاء</option>
          <option value="4">الخميس</option>
          <option value="5">الجمعة</option>
          <option value="6">السبت</option>
        </select>
        <input className="input input-bordered w-full" name="startTime" type="time" required />
        <input className="input input-bordered w-full" name="endTime" type="time" required />
        <input className="input input-bordered w-full" name="maxNum" type="number" min="1" placeholder="عدد الطلاب الأقصى" />
        <button className="btn btn-primary w-full" type="submit">حفظ</button>
      </form>
    </div>
  );
}
