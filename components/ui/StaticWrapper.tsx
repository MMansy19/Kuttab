'use client';

import { ReactNode } from 'react';

type StaticWrapperProps = {
  children: ReactNode;
  className?: string;
};

/**
 * A simplified static wrapper component that replaces AnimationWrapper
 * No animations, just renders children with optional className
 */
export default function StaticWrapper({
  children,
  className = '',
}: StaticWrapperProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

/**
 * A replacement for StaggeredAnimation without animations
 */
export function StaticGroup({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

/**
 * Static fade-in replacement
 */
export function StaticFade({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

/**
 * Static slide-in replacement 
 */
export function StaticSlide({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

/**
 * Static scale replacement
 */
export function StaticScale({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
