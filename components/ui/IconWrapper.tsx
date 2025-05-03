'use client';

import { motion } from '@/utils/framer-motion';
import { ReactNode } from 'react';

export type IconWrapperProps = {
  children: ReactNode;
  className?: string;
  animate?: 'pulse' | 'bounce' | 'spin' | 'shake' | 'none';
  hoverAnimate?: 'pulse' | 'bounce' | 'spin' | 'shake' | 'none';
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export default function IconWrapper({
  children,
  className = '',
  animate = 'none',
  hoverAnimate,
  color = 'text-emerald-600 dark:text-emerald-400',
  size = 'md',
}: IconWrapperProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const animationVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'loop' as const,
      },
    },
    bounce: {
      y: [0, -5, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: 'loop' as const,
      },
    },
    spin: {
      rotate: [0, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      },
    },
    shake: {
      x: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 2,
      },
    },
    none: {},
  };

  return (
    <motion.div
      className={`${color} ${sizeClasses[size]} ${className}`}
      animate={animate !== 'none' ? animationVariants[animate] : undefined}
      whileHover={hoverAnimate && hoverAnimate !== 'none' ? animationVariants[hoverAnimate] : undefined}
    >
      {children}
    </motion.div>
  );
}

// Usage examples:
// <IconWrapper animate="pulse"><FaBook /></IconWrapper>
// <IconWrapper animate="bounce" color="text-blue-500" size="lg"><FaGraduationCap /></IconWrapper>
// <IconWrapper animate="none" hoverAnimate="pulse"><FaUserFriends /></IconWrapper>