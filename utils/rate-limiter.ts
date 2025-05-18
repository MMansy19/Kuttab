import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for rate limiting
// In production, use Redis or another distributed cache
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  limit?: number; // Number of requests allowed in the interval
  interval?: number; // Time window in seconds
  identifier?: (req: NextRequest) => string; // Function to identify the client
}

/**
 * Rate limiting middleware for API routes
 * @param options Rate limiting options
 * @returns A function that can be used as middleware
 */
export function rateLimit(options: RateLimitOptions = {}) {
  const {
    limit = 20, // Default: 20 requests
    interval = 60, // Default: per minute
    identifier = (req) => req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'anonymous', // Default: IP address
  } = options;

  return async function rateLimitMiddleware(req: NextRequest) {
    const clientId = identifier(req);
    const now = Date.now();
    
    // Clean up expired entries
    Array.from(rateLimitStore.keys()).forEach(key => {
      const value = rateLimitStore.get(key);
      if (value && value.resetTime < now) {
        rateLimitStore.delete(key);
      }
    });
    
    // Get or create client entry
    let clientData = rateLimitStore.get(clientId);
    if (!clientData || clientData.resetTime < now) {
      clientData = { count: 0, resetTime: now + interval * 1000 };
      rateLimitStore.set(clientId, clientData);
    }
    
    // Increment request count
    clientData.count += 1;
    
    // Set headers for client
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', limit.toString());
    headers.set('X-RateLimit-Remaining', Math.max(0, limit - clientData.count).toString());
    headers.set('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());
    
    // Check if limit is exceeded
    if (clientData.count > limit) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'تم تجاوز الحد الأقصى للطلبات، يرجى المحاولة مرة أخرى لاحقًا' 
        }),
        { 
          status: 429, 
          headers,
          statusText: 'Too Many Requests' 
        }
      );
    }
    
    return null; // Continue with the request
  };
}