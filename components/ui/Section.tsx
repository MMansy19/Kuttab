import React from 'react';
import { cn } from '../../utils/cn';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  background?: 'default' | 'light' | 'dark' | 'primary' | 'gradient';
  containerWidth?: 'full' | 'container' | 'narrow';
  spacing?: 'none' | 'small' | 'medium' | 'large';
}

export function Section({
  background = 'default',
  containerWidth = 'container',
  spacing = 'medium',
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden w-full',
        background === 'default' && 'bg-white dark:bg-gray-900',
        background === 'light' && 'bg-gray-50 dark:bg-gray-800',
        background === 'dark' && 'bg-gray-900 dark:bg-black text-white',
        background === 'primary' && 'bg-emerald-600 text-white',
        background === 'gradient' && 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white',
        spacing === 'small' && 'py-8',
        spacing === 'medium' && 'py-12 md:py-16',
        spacing === 'large' && 'py-16 md:py-24',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'px-4 mx-auto relative z-10',
          containerWidth === 'container' && 'container',
          containerWidth === 'narrow' && 'max-w-4xl mx-auto',
        )}
      >
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  centered?: boolean;
  accentColor?: 'default' | 'emerald' | 'blue' | 'amber' | 'white';
}

export function SectionHeader({ 
  title, 
  description, 
  centered = false, 
  accentColor = 'default',
  className,
  ...props 
}: SectionHeaderProps) {
  const accentClasses = {
    default: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    white: 'bg-white/20 text-white'
  };

  return (
    <div 
      className={cn(
        'mb-8 md:mb-12',
        centered && 'text-center',
        className
      )}
      {...props}
    >
      {accentColor && (
        <div className={cn(
          "inline-block px-4 py-1 rounded-full text-sm font-medium mb-4",
          accentClasses[accentColor]
        )}>
          {title.split(' ')[0]}
        </div>
      )}
      <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
      {description && (
        <p className={cn(
          "text-lg text-gray-600 dark:text-gray-400 max-w-3xl",
          centered && 'mx-auto'
        )}>
          {description}
        </p>
      )}
    </div>
  );
}

export default Section;