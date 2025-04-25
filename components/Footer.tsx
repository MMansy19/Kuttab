export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-6 px-4 mt-8 text-center text-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 container mx-auto">
        <div>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} كُـــتَّـــاب | KOTTAB</div>
        <div className="flex gap-4">
          <a href="/about" className="hover:text-blue-400 transition">من نحن</a>
          <a href="/donate" className="hover:text-blue-400 transition">تبرع</a>
          <a href="/contact" className="hover:text-blue-400 transition">تواصل معنا</a>
        </div>
      </div>
    </footer>
  );
}