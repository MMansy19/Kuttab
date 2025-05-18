/**
 * Application configuration for different deployment modes
 */

// Determine if we're running in frontend-only mode
// This will be true if NEXT_PUBLIC_FRONTEND_ONLY is set to 'true' or if DATABASE_URL is 'frontend-only'
export const isFrontendOnlyMode = 
  process.env.NEXT_PUBLIC_FRONTEND_ONLY === 'true' || 
  process.env.DATABASE_URL === 'frontend-only' ||
  // For client-side, we never want to run database operations
  (typeof window !== 'undefined');
