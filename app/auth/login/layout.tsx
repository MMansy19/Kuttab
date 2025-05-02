import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول - كُتّاب",
  description: "قم بتسجيل الدخول إلى حسابك في منصة كُتّاب لتعلم القرآن والعلوم الإسلامية",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}