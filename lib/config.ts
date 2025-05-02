/**
 * Application configuration for different deployment modes
 */

// Determine if we're running in frontend-only mode
// This will be true if DATABASE_URL is not provided in production
export const isFrontendOnlyMode = process.env.NEXT_PUBLIC_FRONTEND_ONLY === 'true' || 
  (process.env.NODE_ENV === 'production' && 
   (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'frontend-only'));

// Console output is suppressed in production
if (process.env.NODE_ENV !== 'production') {
  console.log(`Running in ${isFrontendOnlyMode ? 'frontend-only' : 'full'} mode`);
}

// Export application config
export const appConfig = {
  isFrontendOnlyMode,
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  disableAuth: isFrontendOnlyMode, // Disable authentication in frontend-only mode
};