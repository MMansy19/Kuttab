'use client';

import { useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { isBrowser, isBroadcastChannelSupported, safeAddWindowListener } from '../utils/browser-check';

// Auth sync event types
type AuthSyncEventType = 'AUTH_LOGOUT' | 'AUTH_LOGIN' | 'AUTH_REFRESH' | 'AUTH_ERROR';

interface AuthSyncEvent {
  type: AuthSyncEventType;
  timestamp: number;
  data?: {
    reason?: string;
    [key: string]: any;
  }
}

interface AuthSyncContextType {
  notifyLogout: () => void;
  notifyLogin: () => void;
  notifyTokenRefresh: () => void;
}

// Create context with default values
const AuthSyncContext = createContext<AuthSyncContextType>({
  notifyLogout: () => {},
  notifyLogin: () => {},
  notifyTokenRefresh: () => {},
});

/**
 * Creates and initializes a communication channel for auth sync
 */
function createAuthSyncChannel() {
  let channel: BroadcastChannel | null = null;
    // Function to broadcast an event
  const broadcastEvent = (eventType: AuthSyncEventType, data?: any) => {
    const event: AuthSyncEvent = {
      type: eventType,
      timestamp: Date.now(),
      data
    };
    
    // Only attempt to broadcast in browser environment
    if (!isBrowser()) return;
    
    if (isBroadcastChannelSupported()) {
      try {
        // Try to use BroadcastChannel first (modern browsers)
        if (!channel) {
          channel = new BroadcastChannel('auth_sync_channel');
        }
        channel.postMessage(event);
      } catch (err) {
        // Fall back to localStorage
        try {
          localStorage.setItem('auth_sync_event', JSON.stringify(event));
          // Trigger a storage event manually for Safari private mode
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'auth_sync_event',
            newValue: JSON.stringify(event)
          }));
        } catch (storageErr) {
          console.error('Failed to use localStorage for auth sync:', storageErr);
        }
      }
    } else {
      // For browsers that don't support BroadcastChannel
      try {
        localStorage.setItem('auth_sync_event', JSON.stringify(event));
      } catch (storageErr) {
        console.error('Failed to use localStorage for auth sync:', storageErr);
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

interface AuthSyncProviderProps {
  children: ReactNode;
}

/**
 * Provider that syncs auth state across browser tabs
 */
export function AuthSyncProvider({ children }: AuthSyncProviderProps) {
  const { data: session } = useSession();
  
  // Handle auth events from other tabs
  const handleAuthEvent = useCallback((event: AuthSyncEvent) => {
    switch(event.type) {
      case 'AUTH_LOGOUT':
        // If we're currently logged in, sign out
        if (session) {
          signOut({ redirect: false });
        }
        break;
        
      case 'AUTH_REFRESH':
        // Could trigger a session refresh if needed
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
  
  // Set up listeners for auth events from other tabs
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
    let cleanup = () => {};
    
    // Only attempt to set up listeners in browser environment
    if (isBrowser()) {
      if (isBroadcastChannelSupported()) {
        try {
          channel = new BroadcastChannel('auth_sync_channel');
          channel.addEventListener('message', handleBroadcastEvent);
        } catch (err) {
          console.error('Failed to create BroadcastChannel:', err);
          // Fallback to localStorage
          cleanup = safeAddWindowListener('storage', handleStorageEvent as EventListener);
        }
      } else {
        // For browsers without BroadcastChannel support
        cleanup = safeAddWindowListener('storage', handleStorageEvent as EventListener);
      }
    }
    
    // Cleanup function
    return () => {
      if (channel) {
        channel.removeEventListener('message', handleBroadcastEvent);
        channel.close();
      } 
      // Execute any registered cleanup for event listeners
      cleanup();
    };
  }, [handleAuthEvent]);
  
  // Context value with notification functions
  const contextValue = {
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
  
  return (
    <AuthSyncContext.Provider value={contextValue}>
      {children}
    </AuthSyncContext.Provider>
  );
}

/**
 * Hook to access auth sync functionality
 */
export function useAuthSync() {
  return useContext(AuthSyncContext);
}