import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[70vh] gap-6">
      <h1 className="text-4xl md:text-5xl font-bold mb-2">مرحبا بكم في كُـــتَّـــاب</h1>
      <p className="mb-6 text-lg md:text-xl text-gray-300 max-w-2xl">
        منصة تعليمية تجمع بين الطلاب والمعلمين لجلسات تعليمية مميزة عبر الإنترنت. احجز معلمك الآن وابدأ رحلتك التعليمية.
      </p>
      <nav className="flex flex-wrap gap-4 justify-center">
        <Link href="/about" className="px-6 py-2 rounded bg-blue-700 hover:bg-blue-800 transition text-white font-semibold">من نحن</Link>
        <Link href="/teachers" className="px-6 py-2 rounded bg-green-700 hover:bg-green-800 transition text-white font-semibold">قائمة المعلمين</Link>
        <Link href="/auth/login" className="px-6 py-2 rounded bg-gray-800 hover:bg-gray-900 transition text-white font-semibold">تسجيل الدخول</Link>
        <Link href="/auth/signup" className="px-6 py-2 rounded bg-gray-600 hover:bg-gray-700 transition text-white font-semibold">إنشاء حساب</Link>
        <Link href="/dashboard/user" className="px-6 py-2 rounded bg-indigo-700 hover:bg-indigo-800 transition text-white font-semibold">لوحة التحكم</Link>
      </nav>
    </section>
  );
}
