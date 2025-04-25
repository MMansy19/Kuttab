export default function ContactPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">تواصل معنا</h1>
      <p className="max-w-xl text-center text-lg mb-6">لأي استفسار أو اقتراح، يرجى التواصل معنا عبر البريد الإلكتروني: <span className="font-mono">info@kottab.com</span></p>
      <form className="w-full max-w-md flex flex-col gap-4">
        <input type="text" placeholder="الاسم" className="p-2 rounded bg-gray-800 text-white" />
        <input type="email" placeholder="البريد الإلكتروني" className="p-2 rounded bg-gray-800 text-white" />
        <textarea placeholder="رسالتك" className="p-2 rounded bg-gray-800 text-white min-h-[100px]" />
        <button type="submit" className="bg-blue-700 hover:bg-blue-800 rounded text-white font-bold py-2">إرسال</button>
      </form>
    </main>
  );
}