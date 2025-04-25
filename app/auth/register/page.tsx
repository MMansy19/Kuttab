import React from 'react';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form className="w-full max-w-sm p-8 bg-white rounded shadow-md space-y-4 rtl">
        <h2 className="text-2xl font-bold text-center">إنشاء حساب</h2>
        <input className="input input-bordered w-full" name="name" type="text" placeholder="الاسم" required />
        <input className="input input-bordered w-full" name="email" type="email" placeholder="البريد الإلكتروني" required />
        <input className="input input-bordered w-full" name="password" type="password" placeholder="كلمة المرور" required />
        <select className="input input-bordered w-full" name="role" required>
          <option value="USER">طالب</option>
          <option value="TEACHER">معلم</option>
        </select>
        <button className="btn btn-primary w-full" type="submit">تسجيل</button>
      </form>
    </div>
  );
}
