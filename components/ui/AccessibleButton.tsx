'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface AccessibleButtonProps {
  text: string;
  ariaLabel?: string;
  className?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'success' | 'danger' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'block';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Creates accessibility-friendly buttons with proper aria labels, focus states, and contrast
 */
export function AccessibleButton({
  text,
  ariaLabel,
  className,
  icon,
  variant = 'default',
  size = 'default',
  onClick,
  type = 'button'
}: AccessibleButtonProps) {  return (
    <Button
      type={type}
      onClick={onClick}
      variant={variant}
      size={size}
      className={cn(
        'min-w-[44px] min-h-[44px] flex items-center gap-2 touch-manipulation',
        className
      )}
      aria-label={ariaLabel || text} // Ensure there's always an accessible name
    >
      {icon && <span className="icon-wrapper">{icon}</span>}
      <span>{text}</span>
    </Button>
  );
}
