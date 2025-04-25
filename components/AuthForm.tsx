import React from 'react';

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  // حالة وهمية للحقول
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password || (mode === 'signup' && !name)) {
      setError('يرجى تعبئة جميع الحقول');
      return;
    }
    setSuccess(mode === 'login' ? 'تم تسجيل الدخول بنجاح (وهمي)' : 'تم إنشاء الحساب بنجاح (وهمي)');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-md mx-auto flex flex-col gap-4 mt-8">
      <h2 className="text-2xl font-bold mb-2 text-center">
        {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
      </h2>
      {mode === 'signup' && (
        <div>
          <label className="block mb-1 text-right">الاسم الكامل</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="أدخل اسمك الكامل"
            dir="rtl"
          />
        </div>
      )}
      <div>
        <label className="block mb-1 text-right">البريد الإلكتروني</label>
        <input
          type="email"
          className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="example@email.com"
          dir="rtl"
        />
      </div>
      <div>
        <label className="block mb-1 text-right">كلمة المرور</label>
        <input
          type="password"
          className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          dir="rtl"
        />
      </div>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      {success && <div className="text-green-500 text-sm text-center">{success}</div>}
      <button type="submit" className="w-full py-2 rounded bg-blue-700 hover:bg-blue-800 transition text-white font-semibold mt-2">
        {mode === 'login' ? 'دخول' : 'إنشاء حساب'}
      </button>
    </form>
  );
}