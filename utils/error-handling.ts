/**
 * Utility functions for error handling in async operations
 */

/**
 * Async function wrapper that handles errors with try-catch
 * @param asyncFn The async function to execute
 * @param onError Optional error handler function
 * @returns A tuple with [data, error]
 */
export async function tryCatch<T>(
  asyncFn: () => Promise<T>,
  onError?: (error: Error) => void
): Promise<[T | null, Error | null]> {
  try {
    const data = await asyncFn();
    return [data, null];
  } catch (error) {
    // Convert to Error type
    const err = error instanceof Error ? error : new Error(String(error));
    
    // Call error handler if provided
    if (onError) {
      onError(err);
    }
    
    // In development, log the error to console
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error caught in tryCatch:', err);
    }
    
    return [null, err];
  }
}

/**
 * React hook version of tryCatch for use in components
 * @param asyncFn The async function to execute
 * @param deps Dependencies array for useCallback
 * @returns A function that returns a promise with [data, error]
 */
export function useAsyncHandler<T, Args extends any[]>(
  asyncFn: (...args: Args) => Promise<T>,
) {
  return async (...args: Args): Promise<[T | null, Error | null]> => {
    try {
      const data = await asyncFn(...args);
      return [data, null];
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      
      // In development, log the error to console
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error caught in useAsyncHandler:', err);
      }
      
      return [null, err];
    }
  };
}

/**
 * Creates a handler for Promise rejections to avoid unhandled rejections
 * Useful for fire-and-forget promises
 * @param context Context information to include in error logs
 * @returns A function to handle Promise rejections
 */
export function createPromiseErrorHandler(context: string) {
  return (error: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Unhandled Promise error in ${context}:`, error);
    }
    
    // Optional: Send to error monitoring service
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
  };
}

/**
 * Helper to safely execute a callback function that might throw
 * @param fn Function to execute
 * @param fallbackValue Value to return if function throws
 * @returns Result of function or fallback value
 */
export function safeExecute<T>(fn: () => T, fallbackValue: T): T {
  try {
    return fn();
  } catch (error) {
    // In development, log the error to console
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error in safeExecute:', error);
    }
    return fallbackValue;
  }
}
