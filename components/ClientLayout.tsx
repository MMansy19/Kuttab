'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import SchemaOrgData from './seo/SchemaOrgData';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth') || false;
  

  if (isDashboard) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <SchemaOrgData />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <Footer />
    </>
  );
}