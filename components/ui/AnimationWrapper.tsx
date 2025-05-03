'use client';

import { motion, Variants, TargetAndTransition, VariantLabels } from '@/utils/framer-motion';
import { ReactNode } from 'react';

type AnimationWrapperProps = {
  children: ReactNode;
  className?: string;
  initial?: TargetAndTransition | VariantLabels;
  animate?: TargetAndTransition | VariantLabels;
  exit?: TargetAndTransition | VariantLabels;
  transition?: any;
  delay?: number;
};

export default function AnimationWrapper({
  children,
  className = '',
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  exit = { opacity: 0, y: 20 },
  transition = { duration: 0.5 },
  delay = 0,
}: AnimationWrapperProps) {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ ...transition, delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredAnimation({
  children,
  className = '',
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({
  children,
  className = '',
  delay = 0,
  direction = null,
  scale = 1,
  duration = 0.5,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | null;
  scale?: number;
  duration?: number;
}) {
  const directionValues = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    null: {}
  };

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0,
        scale: scale !== 1 ? scale : undefined,
        ...directionValues[direction || 'null']
      }}
      animate={{ 
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({
  children,
  className = '',
  delay = 0,
  direction = 'right',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const directionMap = {
    up: { y: '100%' },
    down: { y: '-100%' },
    left: { x: '100%' },
    right: { x: '-100%' }
  };

  const initial = directionMap[direction];

  return (
    <motion.div
      className={className}
      initial={{ ...initial, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
}

export function Hover({
  children,
  className = '',
  scale = 1.05,
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.div>
  );
}

export function Bounce({ 
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 10,
        delay
      }}
    >
      {children}
    </motion.div>
  );
}