"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { FaBell } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import Badge from "./ui/Badge";
import { useSession } from "next-auth/react";
import { refreshSession, handleAuthError, clearSessionCache } from "@/lib/session";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

export default function NotificationBell() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Memoized fetch function to prevent unnecessary re-creation
  const fetchNotifications = useCallback(async () => {
    // Don't attempt to fetch if not authenticated or component is unmounted
    if (status !== "authenticated" || !session || !isMountedRef.current) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch("/api/notifications?limit=5&unread=true", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        // Handle auth errors with our utility
        if (await handleAuthError(response.status)) {
          return;
        }
        
        // Handle other errors
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "فشل في جلب الإشعارات");
      }

      const data = await response.json();
      
      if (isMountedRef.current) {
        setNotifications(data.data || []);
        setUnreadCount(data.metadata?.unreadCount || 0);
      }
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      if (isMountedRef.current) {
        setError(err.message || "حدث خطأ أثناء جلب الإشعارات");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [status, session]);

  // Set up polling with cleanup
  useEffect(() => {
    isMountedRef.current = true;
    
    // Only fetch notifications if the user is authenticated
    if (status === "authenticated" && session) {
      fetchNotifications();

      // Set up polling for new notifications every minute, with debounce
      fetchTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          fetchNotifications();
        }
      }, 60000); // 1 minute
    }
    
    // Clean up on component unmount
    return () => {
      isMountedRef.current = false;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [status, session, fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mark a notification as read
  const markAsRead = async (id: string, event: React.MouseEvent) => {
    // Don't attempt to mark if not authenticated
    if (status !== "authenticated" || !session) {
      return;
    }
    
    event.stopPropagation(); // Prevent dropdown from closing
    
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'same-origin',
        body: JSON.stringify({ isRead: true }),
      });

      if (!response.ok) {
        // Handle auth errors with our utility
        if (await handleAuthError(response.status)) {
          return;
        }
        
        throw new Error("فشل في تحديث حالة الإشعار");
      }

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async (event: React.MouseEvent) => {
    // Don't attempt to mark if not authenticated
    if (status !== "authenticated" || !session) {
      return;
    }
    
    event.stopPropagation(); // Prevent dropdown from closing
    
    try {
      // Use the PATCH endpoint with no IDs to mark all as read
      const response = await fetch(`/api/notifications`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'same-origin',
        body: JSON.stringify({ isRead: true }),
      });

      if (!response.ok) {
        // Handle auth errors with our utility
        if (await handleAuthError(response.status)) {
          return;
        }
        
        throw new Error("فشل في تحديث حالة الإشعارات");
      }

      // Update local state
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Get notification color based on type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case "BOOKING":
        return "bg-green-500";
      case "REVIEW":
        return "bg-blue-500";
      case "SYSTEM":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  // If user is not authenticated, don't render the notification bell
  if (status !== "authenticated" || !session) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <FaBell className="text-gray-600 dark:text-gray-300 h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white">الإشعارات</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
              >
                اشر عليها بأنها قُرأت
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="px-4 py-2 text-sm text-red-500 dark:text-red-400">
                {error}
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                لا يوجد إشعارات جديدة
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={
                    notification.type === "BOOKING" && notification.relatedId
                      ? `/dashboard/${notification.type === "BOOKING" ? "user/bookings/" + notification.relatedId : "notifications"}`
                      : "/dashboard/notifications"
                  }
                  onClick={(e) => markAsRead(notification.id, e)}
                  className={`block px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                    !notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`h-2 w-2 mt-2 rounded-full ml-2 ${
                        getNotificationColor(notification.type)
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {notification.isRead === false && (
                      <Badge variant="info" className="ml-2 text-xs">
                        جديد
                      </Badge>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 py-2 px-4 text-center">
            <Link
              href="/dashboard/notifications"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              onClick={() => setIsOpen(false)}
            >
              عرض كل الإشعارات
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}