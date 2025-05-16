// app/dashboard/layout.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/features/auth/services/auth-options";
import LoadingScreen from "@/components/LoadingScreen";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    const callbackUrl = `/dashboard`;
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link
          rel="preload"
          href="/images/icon-192x192.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingScreen />
        <div className="flex min-h-screen">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-800 shadow-sm">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">لوحة التحكم</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">
                  مرحباً، {session.user.name}
                </span>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-6">
              {children}
            </main>

            {/* Footer */}
            <footer className="py-4 px-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                جميع الحقوق محفوظة &copy; {new Date().getFullYear()} كتّاب
              </p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}