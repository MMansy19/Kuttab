import { Metadata } from "next";

export const metadata: Metadata = {
  title: "إنشاء حساب جديد - كُتّاب",
  description: "سجل حساب جديد في منصة كُتّاب لتعلم القرآن والعلوم الإسلامية",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}