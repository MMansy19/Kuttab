import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Login | KOTTAB",
  description: "Sign in to your KOTTAB account",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}