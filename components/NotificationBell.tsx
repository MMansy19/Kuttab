"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaBell } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import Badge from "./ui/Badge";

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();

    // Set up polling for new notifications every minute
    const intervalId = setInterval(fetchNotifications, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/notifications?limit=5&unread=true");
      
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data.data || []);
      setUnreadCount(data.metadata?.unreadCount || 0);
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dropdown from closing
    
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to update notification");
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
    event.stopPropagation(); // Prevent dropdown from closing
    
    try {
      // Ideally we would have a bulk update API endpoint, but for now we'll update each one
      const promises = notifications
        .filter(notification => !notification.isRead)
        .map(notification => 
          fetch(`/api/notifications/${notification.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ isRead: true }),
          })
        );

      await Promise.all(promises);

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
                  onClick={() => markAsRead(notification.id, event as React.MouseEvent)}
                  className={`block px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                    !notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`h-2 w-2 mt-2 rounded-full mr-2 ${
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
                      <Badge variant="primary" className="ml-2 text-xs">
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