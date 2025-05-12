"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";
import { FaBell, FaCheck } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import Badge from "@/components/ui/Badge";
import { useSession } from "next-auth/react";
import { useNotifications, Notification } from "./NotificationProvider";
import { Button } from "@/components/ui/Button";

// Memoized notification item for better performance
const NotificationItem = memo(({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: Notification, 
  onMarkAsRead: (id: string) => void 
}) => {
  const formattedTime = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: ar
  });

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div 
      className={`
        p-3 border-b last:border-b-0 border-gray-200 dark:border-gray-700
        ${notification.isRead ? 'bg-transparent' : 'bg-emerald-50 dark:bg-emerald-900/20'}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
            {notification.title}
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
            {notification.message}
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formattedTime}
          </div>
        </div>
        
        <div className="shrink-0">
          {notification.isRead ? (
            <span className="inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></span>
          ) : (
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          )}
        </div>
      </div>
      
      {notification.actionUrl && notification.actionLabel && (
        <div className="mt-2">
          <Link 
            href={notification.actionUrl}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {notification.actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
});

NotificationItem.displayName = 'NotificationItem';

export default function NotificationBell() {
  const { data: session } = useSession();
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    error, 
    markAsRead, 
    markAllAsRead,
    refreshNotifications
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Get 5 most recent notifications
  const recentNotifications = notifications
    .sort((a: Notification, b: Notification) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleToggleDropdown = () => {
    if (!isOpen && unreadCount > 0) {
      refreshNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markAllAsRead();
  };

  // Don't show notification bell for unauthenticated users
  if (!session) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={handleToggleDropdown}
        className="p-2 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none relative"
        aria-label="View notifications"
      >
        <FaBell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="default"
            className="absolute -top-1 -right-1"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          className="absolute z-50 mt-1 right-0 w-80 md:w-96 max-h-[70vh] overflow-hidden bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-w-screen-sm origin-top-right transition-all duration-150"
          style={{ transform: isOpen ? 'scale(1)' : 'scale(0.95)', opacity: isOpen ? 1 : 0 }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              الإشعارات
            </h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  <FaCheck className="ml-1 h-3 w-3" />
                  تعليم الكل كمقروء
                </Button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto max-h-[50vh]">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                جاري التحميل...
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                {error}
                <button 
                  onClick={() => refreshNotifications()} 
                  className="mt-2 text-emerald-600 dark:text-emerald-400 underline text-sm block mx-auto"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : recentNotifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">              {recentNotifications.map((notification: Notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                لا توجد إشعارات حالياً
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 text-center">
            <Link
              href="/dashboard/notifications"
              className="block w-full py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors"
            >
              عرض كل الإشعارات
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
