"use client";

import { memo, useEffect, useRef, useState } from 'react';

interface CounterStatProps {
  endValue: number;
  label: string;
}

// Memoized CounterStat component to prevent unnecessary re-renders
const CounterStat = memo(({ endValue, label }: CounterStatProps) => {
  const [count, setCount] = useState(0);
  const animationRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);
  
  // Easing function for more natural animation
  const easeOutQuad = (t: number): number => t * (2 - t);
  
  // Trigger animation directly when component becomes visible
  useEffect(() => {
    if (isVisible && endValue > 0) {
      const animate = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }
        
        const elapsed = timestamp - startTimeRef.current;
        const duration = 2000; // 2 seconds duration
        
        // Calculate progress and apply easing
        const rawProgress = Math.min(elapsed / duration, 1);
        const progress = easeOutQuad(rawProgress);
        
        // Calculate current value
        const currentValue = Math.floor(progress * endValue);
        setCount(currentValue);
        
        // Continue animation if not complete
        if (rawProgress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Ensure we end exactly at the target value
          setCount(endValue);
        }
      };
      
      // Start animation
      startTimeRef.current = null;
      animationRef.current = requestAnimationFrame(animate);
      
      // Clean up on unmount or when dependencies change
      return () => {
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isVisible, endValue]);
  
  // Set up intersection observer to detect when counter is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );
    
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={observerRef} 
      className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
    >
      <div className="text-3xl font-bold text-white">{count}+</div>
      <div className="text-xs text-gray-300">{label}</div>      
    </div>
  );
});

CounterStat.displayName = 'CounterStat';

export default CounterStat;
