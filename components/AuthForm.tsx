import React from 'react';

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [role, setRole] = React.useState<'USER' | 'TEACHER'>('USER');
  const [bio, setBio] = React.useState('');
  const [experience, setExperience] = React.useState('');
  const [avatar, setAvatar] = React.useState<File | null>(null);
  const [video, setVideo] = React.useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password || (mode === 'signup' && !name)) {
      setError('يرجى تعبئة جميع الحقول');
      return;
    }
    if (mode === 'signup' && role === 'TEACHER') {
      if (!bio || !experience) {
        setError('يرجى تعبئة جميع بيانات المعلم');
        return;
      }
    }
    setSuccess(mode === 'login' ? 'تم تسجيل الدخول بنجاح (وهمي)' : 'تم إنشاء الحساب بنجاح (وهمي)');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-md mx-auto flex flex-col gap-4 mt-8">
      <h2 className="text-2xl font-bold mb-2 text-center">
        {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
      </h2>
      {mode === 'signup' && (
        <>
          <div>
            <label className="block mb-1 text-right">الاسم الكامل</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-white dark:bg-gray-900 text-emerald-900 dark:text-white border border-emerald-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="أدخل اسمك الكامل"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block mb-1 text-right">نوع الحساب</label>
            <select
              className="w-full px-3 py-2 rounded bg-white dark:bg-gray-900 text-emerald-900 dark:text-white border border-emerald-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={role}
              onChange={e => setRole(e.target.value as 'USER' | 'TEACHER')}
              dir="rtl"
            >
              <option value="USER">طالب</option>
              <option value="TEACHER">معلم</option>
            </select>
          </div>
          {role === 'TEACHER' && (
            <>
              <div>
                <label className="block mb-1 text-right">نبذة عنك</label>
                <textarea
                  className="w-full px-3 py-2 rounded bg-white dark:bg-gray-900 text-emerald-900 dark:text-white border border-emerald-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="اكتب نبذة مختصرة عنك"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block mb-1 text-right">سنوات الخبرة</label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 rounded bg-white dark:bg-gray-900 text-emerald-900 dark:text-white border border-emerald-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  placeholder="عدد سنوات الخبرة"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block mb-1 text-right">صورة شخصية (اختياري)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-emerald-900 dark:text-white"
                  onChange={e => setAvatar(e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <label className="block mb-1 text-right">فيديو تعريفي (اختياري)</label>
                <input
                  type="file"
                  accept="video/*"
                  className="w-full text-emerald-900 dark:text-white"
                  onChange={e => setVideo(e.target.files?.[0] || null)}
                />
              </div>
            </>
          )}
        </>
      )}
      <div>
        <label className="block mb-1 text-right">البريد الإلكتروني</label>
        <input
          type="email"
          className="w-full px-3 py-2 rounded bg-white dark:bg-gray-900 text-emerald-900 dark:text-white border border-emerald-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
          className="w-full px-3 py-2 rounded bg-white dark:bg-gray-900 text-emerald-900 dark:text-white border border-emerald-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          dir="rtl"
        />
      </div>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      {success && <div className="text-green-500 text-sm text-center">{success}</div>}
      <button type="submit" className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-800 dark:hover:bg-emerald-900 transition text-white font-semibold mt-2">
        {mode === 'login' ? 'دخول' : 'إنشاء حساب'}
      </button>
    </form>
  );
}