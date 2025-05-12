// Helper functions for image optimization

/**
 * Generates optimal sizes attribute for responsive images
 * 
 * @param defaultSize The default size of the image in pixels (width)
 * @returns A string representing the sizes attribute for the image
 */
export function generateSizes(defaultSize: number = 100): string {
  return `(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, ${defaultSize}px`;
}

/**
 * Determines if WebP format should be used
 * Modern browsers support WebP, which offers better compression than PNG or JPEG
 */
export function useWebP(): boolean {
  // In a client component, you could actually detect browser support
  // For SSR, we'll just return true as Next.js Image handles format negotiation
  return true;
}

/**
 * Helper to generate image props for Next.js Image component with good defaults for performance
 */
export function getOptimizedImageProps(
  src: string,
  alt: string,
  width: number,
  height: number,
  priority: boolean = false
) {
  return {
    src,
    alt,
    width,
    height,
    loading: priority ? 'eager' : 'lazy',
    sizes: generateSizes(width),
    quality: 80, // Good balance between quality and file size
  };
}
