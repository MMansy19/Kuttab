// Simple replacements for animation components to preserve layout without animations
import { ReactNode } from 'react';

export function FadeIn({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className || ''}>{children}</div>;
}

export function StaggeredAnimation({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className || ''}>{children}</div>;
}

export function ScaleIn({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className || ''}>{children}</div>;
}

export function IconWrapper({ children, color }: { children: ReactNode; color?: string; animate?: string }) {
  return <span className={color || ''}>{children}</span>;
}

export default FadeIn;
