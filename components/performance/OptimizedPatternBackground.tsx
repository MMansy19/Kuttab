'use client';

import React, { useEffect, useState, useRef } from 'react';

interface OptimizedPatternBackgroundProps {
  opacity?: number;
  className?: string;
}

/**
 * OptimizedPatternBackground component
 * Renders an Islamic pattern background with optimized loading strategy:
 * 1. Initially renders with an inlined tiny base64 pattern
 * 2. Loads the full-size pattern in the background
 * 3. Switches to the full-size pattern once loaded
 */
export default function OptimizedPatternBackground({ 
  opacity = 0, 
  className = ''
}: OptimizedPatternBackgroundProps) {
  const [isFullSizeLoaded, setIsFullSizeLoaded] = useState(false);
  const fullSizeLoadedRef = useRef(false);
  const patternUrlRef = useRef('/images/islamic-pattern.webp');
  
  useEffect(() => {
    // Only load the full pattern once across instances
    // Check if this particular pattern image is already loaded in the browser cache
    if (!fullSizeLoadedRef.current) {
      const img = new Image();
      img.src = patternUrlRef.current;
      
      // If the image is already in cache, this will fire immediately
      if (img.complete) {
        setIsFullSizeLoaded(true);
        fullSizeLoadedRef.current = true;
      } else {
        // Otherwise wait for it to load
        img.onload = () => {
          setIsFullSizeLoaded(true);
          fullSizeLoadedRef.current = true;
        };
      }
    } else {
      // If already loaded in another instance
      setIsFullSizeLoaded(true);
    }
  }, []);

  return (
    <div 
      className={`absolute inset-0 pattern-bg-hq ${isFullSizeLoaded ? 'loaded' : ''} ${className}`}
      style={{ opacity: isFullSizeLoaded ? opacity : 0 }}
      aria-hidden="true"
    />
  );
}
