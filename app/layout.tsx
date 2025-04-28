import '../styles/globals.css';
import type { ReactNode } from 'react';
import SessionProvider from '../components/SessionProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ToastContainer from '../components/ui/Toast';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-emerald-50 text-emerald-900 dark:bg-gray-900 dark:text-white font-[Cairo] min-h-screen flex flex-col transition-colors duration-300">
        <SessionProvider>
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
          <Footer />
          <ToastContainer />
        </SessionProvider>
      </body>
    </html>
  );
}
