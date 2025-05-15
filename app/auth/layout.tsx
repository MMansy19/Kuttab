import { Metadata } from "next";


export const metadata: Metadata = {
  title: "تسجيل الدخول - كُتّاب",
  description: "قم بتسجيل الدخول إلى حسابك في منصة كُتّاب لتعلم القرآن والعلوم الإسلامية",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800">
      {children}
    </div>
  );
}