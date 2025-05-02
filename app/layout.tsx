import '../styles/globals.css';
import type { ReactNode } from 'react';
import SessionProvider from '../components/SessionProvider';
import ToastContainer from '../components/ui/Toast';
import { ThemeProvider } from '../context/ThemeContext';
import ClientLayout from '../components/ClientLayout';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-emerald-50 text-emerald-900 dark:bg-gray-900 dark:text-white font-[Cairo] min-h-screen flex flex-col transition-colors duration-300">
        <SessionProvider>
          <ThemeProvider>
            <ClientLayout>{children}</ClientLayout>
            <ToastContainer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
