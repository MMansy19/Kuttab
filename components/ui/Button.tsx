'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { motion } from '@/utils/framer-motion';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-700 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-emerald-600 text-white hover:bg-emerald-700",
        outline: "border border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/30",
        ghost: "hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-800 dark:hover:text-emerald-100",
        link: "text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
        success: "bg-green-600 text-white hover:bg-green-700",
        danger: "bg-red-600 text-white hover:bg-red-700",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600",
        gradient: "bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-9 w-9",
        block: "w-full py-3",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  whileHover?: any;
  whileTap?: any;
  animate?: any;
  initial?: any;
  transition?: any;
  variants?: any;
  as?: React.ElementType;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, whileHover, whileTap, animate, initial, transition, variants, as, ...props }, ref) => {
    // Check if any motion props are provided
    const hasMotionProps = !!(whileHover || whileTap || animate || initial || transition || variants);
    
    // Determine which component to use
    const Component = as || (hasMotionProps ? motion.button : 'button');
    
    // Only include motion props if we're using a motion component
    const componentProps = hasMotionProps ? {
      ...props,
      whileHover,
      whileTap, 
      animate,
      initial,
      transition,
      variants
    } : props;
    
    return (
      <Component
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...componentProps}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;