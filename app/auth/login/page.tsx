import React from 'react';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form className="w-full max-w-sm p-8 bg-white rounded shadow-md space-y-4 rtl">
        <h2 className="text-2xl font-bold text-center">تسجيل الدخول</h2>
        <input className="input input-bordered w-full" name="email" type="email" placeholder="البريد الإلكتروني" required />
        <input className="input input-bordered w-full" name="password" type="password" placeholder="كلمة المرور" required />
        <button className="btn btn-primary w-full" type="submit">دخول</button>
      </form>
    </div>
  );
}
