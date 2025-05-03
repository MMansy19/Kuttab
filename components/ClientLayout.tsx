'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from '@/utils/framer-motion';
import { useEffect, useState } from 'react';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animation for page transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10
    },
    animate: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -10
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3
  };
  
  if (isDashboard) {
    return (
      <motion.main 
        className="flex-1"
        key={pathname}
        initial="initial"
        animate={isLoaded ? "animate" : "initial"}
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        {children}
      </motion.main>
    );
  }
  
  return (
    <>
      <Navbar />
      <motion.main 
        className="flex-1 container mx-auto px-4 py-6"
        key={pathname}
        initial="initial"
        animate={isLoaded ? "animate" : "initial"}
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        {children}
      </motion.main>
      <Footer />
    </>
  );
}