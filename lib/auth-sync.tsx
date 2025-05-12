// Auth State Synchronization across multiple tabs
// This module provides utilities for syncing auth state across browser tabs

"use client";

import { useEffect, useCallback } from 'react';
import { signOut, useSession } from 'next-auth/react';

type AuthSyncEventType = 'AUTH_LOGOUT' | 'AUTH_LOGIN' | 'AUTH_REFRESH' | 'AUTH_ERROR';

interface AuthSyncEvent {
  type: AuthSyncEventType;
  timestamp: number;
  data?: any;
}

/**
 * Creates and initializes a BroadcastChannel or localStorage fallback for auth sync
 * @returns A function to broadcast auth events and a cleanup function
 */
export function createAuthSyncChannel() {
  let channel: BroadcastChannel | null = null;
  const LOCAL_STORAGE_KEY = 'auth_sync_event';
  
  // Setup channel with appropriate method based on browser support
  if (typeof window !== 'undefined') {
    if ('BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('auth_sync_channel');
      } catch (err) {
        console.error('Failed to create BroadcastChannel:', err);
      }
    }
  }
  
  // Broadcast an auth event to other tabs
  const broadcastEvent = (eventType: AuthSyncEventType, data?: any) => {
    const event: AuthSyncEvent = {
      type: eventType,
      timestamp: Date.now(),
      data
    };
    
    if (typeof window === 'undefined') return;
    
    if (channel) {
      // Use BroadcastChannel if available
      channel.postMessage(event);
    } else {
      // Fallback to localStorage
      try {
        // Store the event
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(event));
        
        // Remove it after a short delay to trigger storage event in other tabs
        setTimeout(() => {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }, 100);
      } catch (err) {
        console.error('Failed to use localStorage for auth sync:', err);
      }
    }
  };
  
  // Cleanup function
  const cleanup = () => {
    if (channel) {
      channel.close();
      channel = null;
    }
  };
  
  return { broadcastEvent, cleanup };
}

/**
 * Hook to listen for auth state changes across browser tabs
 * Will automatically sign out if another tab signs out
 */
export function useAuthTabSync() {
  const { data: session } = useSession();
  
  const handleAuthEvent = useCallback((event: AuthSyncEvent) => {
    // Handle different event types
    switch(event.type) {
      case 'AUTH_LOGOUT':
        // If we're currently logged in, sign out
        if (session) {
          signOut({ redirect: false });
        }
        break;
        
      case 'AUTH_REFRESH':
        // Could trigger a session refresh if needed
        // This would need to be implemented if you have a way to refresh the session
        break;
        
      case 'AUTH_ERROR':
        // Handle auth errors (e.g. expired token)
        if (session && event.data?.reason === 'token_expired') {
          signOut({ redirect: false });
        }
        break;
        
      default:
        break;
    }
  }, [session]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let channel: BroadcastChannel | null = null;
    
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'auth_sync_event' && e.newValue) {
        try {
          const event: AuthSyncEvent = JSON.parse(e.newValue);
          handleAuthEvent(event);
        } catch (err) {
          console.error('Failed to parse auth sync event:', err);
        }
      }
    };
    
    const handleBroadcastEvent = (e: MessageEvent) => {
      handleAuthEvent(e.data);
    };
    
    // Set up listeners based on browser support
    if ('BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('auth_sync_channel');
        // TypeScript now knows that channel is a BroadcastChannel object
        channel.addEventListener('message', handleBroadcastEvent);
      } catch (err) {
        console.error('Failed to create BroadcastChannel:', err);
        // Fallback to localStorage
        window.addEventListener('storage', handleStorageEvent);
      }
    }
    
    // Cleanup
    return () => {
      if (channel) {
        channel.removeEventListener('message', handleBroadcastEvent);
        channel.close();
      } else {
        window.removeEventListener('storage', handleStorageEvent);
      }
    };
  }, [handleAuthEvent]);
  
  // Return a function to broadcast logout to other tabs
  return {
    notifyLogout: useCallback(() => {
      const { broadcastEvent, cleanup } = createAuthSyncChannel();
      broadcastEvent('AUTH_LOGOUT');
      cleanup();
    }, []),
    
    notifyLogin: useCallback(() => {
      const { broadcastEvent, cleanup } = createAuthSyncChannel();
      broadcastEvent('AUTH_LOGIN');
      cleanup();
    }, []),
    
    notifyTokenRefresh: useCallback(() => {
      const { broadcastEvent, cleanup } = createAuthSyncChannel();
      broadcastEvent('AUTH_REFRESH');
      cleanup();
    }, [])
  };
}
