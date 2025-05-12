// Notification Context Provider and Hooks
// Implements a polling-based notification system

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import http from '@/utils/fetcher';
import { useSession } from 'next-auth/react';

// Define notification types
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Default polling interval in milliseconds
const DEFAULT_POLLING_INTERVAL = 30000; // 30 seconds

interface NotificationProviderProps {
  children: React.ReactNode;
  pollingInterval?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  pollingInterval = DEFAULT_POLLING_INTERVAL,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Fetch notifications from the API
  const fetchNotifications = useCallback(async (): Promise<Notification[]> => {
    if (!session?.user) return [];
    
    try {
      setIsLoading(true);
      const response = await http<{ notifications: Notification[] }>(
        '/api/notifications', 
        { requireAuth: true }
      );
      
      if (!response.ok) {
        throw new Error(response.error || 'Failed to fetch notifications');
      }
      
      return response.data?.notifications || [];
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [session?.user]);

  // Function to refresh notifications on demand
  const refreshNotifications = useCallback(async (): Promise<void> => {
    const fetchedNotifications = await fetchNotifications();
    setNotifications(fetchedNotifications);
  }, [fetchNotifications]);

  // Mark a notification as read
  const markAsRead = useCallback(async (id: string): Promise<void> => {
    if (!session?.user) return;
    
    try {
      // Optimistic update
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
      
      // Call API to persist the change
      const response = await http(
        `/api/notifications/${id}/read`,
        { method: 'PATCH', requireAuth: true }
      );
      
      if (!response.ok) {
        // Revert optimistic update on error
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id ? { ...notification, isRead: false } : notification
          )
        );
        throw new Error(response.error || 'Failed to mark notification as read');
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to update notification');
    }
  }, [session?.user]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async (): Promise<void> => {
    if (!session?.user) return;
    
    try {
      // Optimistic update
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      // Call API to persist the change
      // Call API to persist the change
      const response = await http(
        '/api/notifications/mark-all-read',
        { method: 'POST', requireAuth: true }
      );
      if (!response.ok) {
        // Revert optimistic update on error
        await refreshNotifications();
        throw new Error(response.error || 'Failed to mark all notifications as read');
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to update notifications');
    }
  }, [session?.user, refreshNotifications]);

  // Set up polling for new notifications
  useEffect(() => {
    const startPolling = async () => {
      // Initial fetch
      await refreshNotifications();
      
      // Set up recurring poll
      const poll = async () => {
        await refreshNotifications();
        pollingTimeoutRef.current = setTimeout(poll, pollingInterval);
      };
      
      pollingTimeoutRef.current = setTimeout(poll, pollingInterval);
    };
    
    // Only start polling if user is authenticated
    if (session?.user) {
      startPolling();
    }
    
    // Cleanup function to clear timeout when component unmounts
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [session?.user, pollingInterval, refreshNotifications]);

  // Context value
  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationProvider;
