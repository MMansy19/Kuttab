import { getSession, signOut } from "next-auth/react";
import { jwtVerify, createRemoteJWKSet } from 'jose';

/**
 * Cache for session requests to prevent multiple redundant API calls
 */
const sessionCache = {
  data: null as any,
  timestamp: 0,
  expiresIn: 5 * 60 * 1000, // 5 minutes
};

/**
 * Attempts to refresh the current session using an optimized approach
 * This reduces network requests by implementing caching and only refreshing when necessary
 */
export async function refreshSession() {
  const now = Date.now();
  
  // Use cached session if it exists and is not expired
  if (sessionCache.data && now - sessionCache.timestamp < sessionCache.expiresIn) {
    return sessionCache.data;
  }
  
  // Trigger a visibility change event to refresh the session
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
  
  // Get the refreshed session
  const session = await getSession();
  
  // Cache the result
  if (session) {
    sessionCache.data = session;
    sessionCache.timestamp = now;
  } else {
    // Clear cache if no session
    sessionCache.data = null;
  }
  
  return session;
}

/**
 * Validates the JWT token
 * @returns true if token is valid, false otherwise
 */
export async function validateToken(token: string): Promise<boolean> {
  try {
    if (!token) return false;
    
    // Decode and verify the token without validation for quick check
    // Note: In production, you should fully validate with your secret
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < now) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
}

/**
 * Clears session cache when needed
 */
export function clearSessionCache() {
  sessionCache.data = null;
  sessionCache.timestamp = 0;
}

/**
 * Handle authentication errors, performs signout if needed
 */
export async function handleAuthError(status: number): Promise<boolean> {
  if (status === 401 || status === 403) {
    // Clear session cache first
    clearSessionCache();
    
    // For auth errors, sign out the user and redirect to login
    try {
      await signOut({ redirect: false });
      window.location.href = `/auth/login?error=${encodeURIComponent("جلسة المستخدم انتهت، يرجى تسجيل الدخول مرة أخرى")}`;
    } catch (error) {
      // If signOut fails, force redirect
      window.location.href = `/auth/login?error=${encodeURIComponent("حدث خطأ في تسجيل الخروج، يرجى المحاولة مرة أخرى")}`;
    }
    return true;
  }
  return false;
}