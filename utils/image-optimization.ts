// Helper functions for image optimization

/**
 * Generates optimal sizes attribute for responsive images
 * 
 * @param defaultSize The default size of the image in pixels (width)
 * @param isCritical Whether this is a critical image that may need larger sizes
 * @returns A string representing the sizes attribute for the image
 */
export function generateSizes(defaultSize: number = 100, isCritical: boolean = false): string {
  // Critical images might need higher quality on larger screens
  if (isCritical) {
    return `(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, ${defaultSize}px`;
  }
  return `(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, ${defaultSize}px`;
}

/**
 * Generates a responsive srcSet attribute for images
 * Uses the naming pattern: image-320w.webp, image-480w.webp, etc.
 * 
 * @param src Original image source URL
 * @param format Desired format (webp or avif)
 * @returns A string representing the srcSet attribute
 */
export function generateSrcSet(src: string, format: 'webp' | 'avif' = 'webp'): string {
  // Skip external URLs
  if (src.startsWith('http') && !src.includes(window.location.hostname)) {
    return '';
  }
  
  // Skip if already a generated responsive image
  if (src.includes('-') && (src.includes('w.webp') || src.includes('w.avif'))) {
    return '';
  }
  
  // Get the base path and extension
  const lastDotIndex = src.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  
  const basePath = src.substring(0, lastDotIndex);
  
  // Generate srcSet for standard breakpoints
  const breakpoints = [320, 480, 640, 750, 828, 1080, 1200, 1920];
  
  return breakpoints
    .map(bp => `${basePath}-${bp}w.${format} ${bp}w`)
    .join(', ');
}

/**
 * Convert an image URL to WebP format if it's a local image
 * @param src Original image source URL
 * @param quality WebP quality (0-100)
 * @returns URL for WebP version of the image
 */
export function getWebPUrl(src: string, quality: number = 80): string {
  // If it's a remote URL, return as is - Next.js can't optimize external images
  if (src.startsWith('http') && !src.includes(window.location.hostname)) {
    return src;
  }
  
  // If it's already a WebP, return as is
  if (src.toLowerCase().endsWith('.webp')) {
    return src;
  }
  
  // If it's an image URL with query params
  if (src.includes('?')) {
    return `${src}&format=webp&quality=${quality}`;
  } 
  
  // Add WebP format to local images
  return `${src}?format=webp&quality=${quality}`;
}

/**
 * Helper to generate image props for Next.js Image component with good defaults for performance
 * @param src Image source URL
 * @param alt Alt text for accessibility
 * @param width Image width
 * @param height Image height
 * @param priority Whether this is a high-priority image (above the fold)
 * @param quality Image quality (0-100)
 * @returns Props object for Next.js Image component
 */
export function getOptimizedImageProps(
  src: string,
  alt: string,
  width: number,
  height: number,
  priority: boolean = false,
  quality: number = 80
) {
  // Handle empty/invalid sources
  const safeSrc = (!src || (typeof src === 'string' && !src.startsWith('http') && !src.startsWith('/')))
    ? '/images/placeholder.webp'
    : src;
  
  // Generate a responsive srcSet if this isn't already a responsive image
  const srcSet = generateSrcSet(safeSrc);
  
  const props = {
    src: safeSrc,
    alt: alt || 'Image', // Ensure alt text for accessibility
    width,
    height,
    loading: priority ? 'eager' : 'lazy', // Lazy load non-priority images
    fetchPriority: priority ? 'high' : 'auto', // New browser hint for resource priority
    sizes: generateSizes(width, priority),
    quality, // Good balance between quality and file size
    // Next.js Image automatically uses WebP or AVIF when supported
  };
  
  // Only add srcSet if we generated a valid one
  if (srcSet) {
    return {
      ...props,
      srcSet,
    };
  }
  
  return props;
}
