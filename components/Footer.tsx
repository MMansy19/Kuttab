export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 text-emerald-900 dark:text-white border-t border-accent py-4 mt-8 transition-colors duration-300">
      <div className="container mx-auto text-center">
        <span className="text-accent font-bold">كُتّاب</span> &copy; {new Date().getFullYear()} جميع الحقوق محفوظة
      </div>
    </footer>
  );
}