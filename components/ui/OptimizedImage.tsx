'use client';

import Image from 'next/image';
import { getOptimizedImageProps } from '@/utils/image-optimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

/**
 * A wrapper for Next.js Image component with built-in performance optimizations
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
}: OptimizedImageProps) {
  // For accessibility, ensure alt text is present
  const safeAlt = alt || 'Image';
  
  // Handle empty src or src that doesn't start with http or /
  const safeSrc = (!src || (typeof src === 'string' && !src.startsWith('http') && !src.startsWith('/')))
    ? '/images/placeholder.webp'
    : src;
    
  // If using fill mode, handle differently
  if (fill) {
    return (
      <div className={`relative ${className || ''}`} style={{ aspectRatio: `${width}/${height}` }}>
        <Image
          src={safeSrc}
          alt={safeAlt} 
          fill
          sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? 'high' : 'auto'}
          quality={80}
          className="object-cover"
        />
      </div>
    );
  }
  
  // Regular image with width/height
  return (
    <Image
      {...getOptimizedImageProps(safeSrc, safeAlt, width, height, priority)}
      className={className}
      fetchPriority={priority ? 'high' : 'auto'}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
