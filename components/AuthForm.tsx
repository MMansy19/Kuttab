import React from 'react';

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [role, setRole] = React.useState<'USER' | 'TEACHER'>('USER');
  const [bio, setBio] = React.useState('');
  const [avatar, setAvatar] = React.useState<File | null>(null);
  const [video, setVideo] = React.useState<File | null>(null);
  const [gender, setGender] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password || (mode === 'signup' && !name)) {
      setError('يرجى تعبئة جميع الحقول');
      return;
    }
    if (mode === 'signup' && role === 'TEACHER') {
      if (!bio) {
        setError('يرجى تعبئة جميع بيانات المعلم');
        return;
      }
    }
    setSuccess(mode === 'login' ? 'تم تسجيل الدخول بنجاح (وهمي)' : 'تم إنشاء الحساب بنجاح (وهمي)');
  };

  return (
    <form onSubmit={handleSubmit} className="dark:bg-gray-800 bg-white rounded-lg shadow-md p-8 w-full max-w-md mx-auto flex flex-col gap-4 mt-8">
      <h2 className="text-2xl font-bold mb-2 text-center">
        {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
      </h2>
      {mode === 'signup' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="block mb-1 text-right">الجنس</label>
              <select
                className="w-full px-3 py-2 rounded bg-white dark:bg-gray-900 text-emerald-900 dark:text-white border border-emerald-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={gender}
                onChange={e => setGender(e.target.value)}
                dir="rtl"
              >
                <option value="">اختر الجنس</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-right">فيديو تعريفي (اختياري)</label>
                  <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <span>رفع فيديو</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={e => setVideo(e.target.files?.[0] || null)}
                    />
                  </label>
                  {video && <span className="block mt-1 text-xs text-emerald-300">{video.name}</span>}
                </div>     
                {gender === 'male' && (
                  <div>
                    <label className="block mb-1 text-right">صورة شخصية (اختياري)</label>
                    <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>رفع صورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => setAvatar(e.target.files?.[0] || null)}
                      />
                    </label>
                    {avatar && <span className="block mt-1 text-xs text-emerald-300">{avatar.name}</span>}
                  </div>
                )}
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