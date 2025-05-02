"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaBell, FaCheck, FaTrash } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import {Card} from "@/components/ui/Card";
import {Button} from "@/components/ui/Button";
import {Badge} from "@/components/ui/Badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

interface Metadata {
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function NotificationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"all" | "unread">(
    searchParams.get("filter") === "unread" ? "unread" : "all"
  );

  // Calculate current page from URL or default to 1
  const currentPage = searchParams.get("page") 
    ? parseInt(searchParams.get("page") as string) 
    : 1;

  useEffect(() => {
    fetchNotifications(currentPage, selectedTab === "unread");
  }, [currentPage, selectedTab]);

  // Fetch notifications from API
  const fetchNotifications = async (page: number, unreadOnly: boolean) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/notifications?page=${page}&limit=10${unreadOnly ? "&unread=true" : ""}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data.data);
      setMetadata(data.metadata);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
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

      // Update metadata
      if (metadata) {
        setMetadata({
          ...metadata,
          unreadCount: Math.max(0, metadata.unreadCount - 1),
        });
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
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

      // Update metadata
      if (metadata) {
        setMetadata({
          ...metadata,
          unreadCount: 0,
        });
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Delete a notification
  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      // Update local state
      const deletedNotification = notifications.find(n => n.id === id);
      setNotifications(notifications.filter(n => n.id !== id));

      // Update metadata
      if (metadata && deletedNotification) {
        setMetadata({
          ...metadata,
          total: metadata.total - 1,
          unreadCount: deletedNotification.isRead 
            ? metadata.unreadCount 
            : metadata.unreadCount - 1,
        });
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Navigate to related content if applicable
    if (notification.relatedId) {
      switch (notification.type) {
        case "BOOKING":
          router.push(`/dashboard/user/bookings/${notification.relatedId}`);
          break;
        case "REVIEW":
          router.push(`/dashboard/teacher/reviews`);
          break;
        default:
          // Do nothing special
          break;
      }
    }
  };

  // Get notification badge color based on type
  const getNotificationBadgeVariant = (type: string) => {
    switch (type) {
      case "BOOKING":
        return "success";
      case "REVIEW":
        return "info";
      case "SYSTEM":
        return "warning";
      default:
        return "default";
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    if (selectedTab === "unread") {
      params.set("filter", "unread");
    } else {
      params.delete("filter");
    }
    router.push(`/dashboard/notifications?${params.toString()}`);
  };

  // Change tab
  const handleTabChange = (tab: "all" | "unread") => {
    setSelectedTab(tab);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (tab === "unread") {
      params.set("filter", "unread");
    } else {
      params.delete("filter");
    }
    router.push(`/dashboard/notifications?${params.toString()}`);
  };

  if (isLoading && !notifications.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="sr-only">جاري التحميل...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-md" dir="rtl">
        خطأ: {error}
      </div>
    );
  }

  return (
      <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div><span className="sr-only">جاري التحميل...</span></div>}>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white" dir="rtl">الإشعارات</h1>
        {metadata && metadata.unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead} 
            className="flex items-center gap-2"
            dir="rtl"
          >
            <FaCheck size={14} />
            <span>تعليم الكل كمقروءة</span>
          </Button>
        )}
      </div>

      {/* Tabs for filtering */}
      <div className="flex space-x-2 border-b dark:border-gray-700">
        <button
          onClick={() => handleTabChange("all")}
          className={`pb-2 px-4 ${
            selectedTab === "all"
              ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400 font-medium"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          الكل
        </button>
        <button
          onClick={() => handleTabChange("unread")}
          className={`pb-2 px-4 ${
            selectedTab === "unread"
              ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400 font-medium"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          غير مقروءة
          {metadata && metadata.unreadCount > 0 && (
            <span className="ml-2 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 text-xs font-medium px-2 py-0.5 rounded-full">
              {metadata.unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications list */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="p-6 text-center">
            <FaBell className="mx-auto text-gray-400 dark:text-gray-600 text-4xl mb-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1" dir="rtl">
              لا توجد إشعارات
            </h3>
            <p className="text-gray-500 dark:text-gray-400" dir="rtl">
              {selectedTab === "unread" 
                ? "ليس لديك إشعارات غير مقروءة." 
                : "ليس لديك أي إشعارات في الوقت الحالي."}
            </p>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-colors ${
                notification.isRead
                  ? "bg-white dark:bg-gray-900"
                  : "bg-blue-50 dark:bg-blue-900/20"
              }`}
            >
              <div className="flex justify-between items-start">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 dark:text-white" dir="rtl">
                      {notification.title}
                    </h3>
                    <Badge variant={getNotificationBadgeVariant(notification.type)} dir="rtl">
                      {notification.type === "BOOKING" ? "حجز" : 
                       notification.type === "REVIEW" ? "تقييم" : 
                       notification.type === "SYSTEM" ? "النظام" : notification.type}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-1" dir="rtl">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2" dir="rtl">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                      title="تعليم كمقروءة"
                    >
                      <FaCheck size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                    title="حذف الإشعار"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {metadata && metadata.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              dir="rtl"
            >
              السابق
            </Button>
            
            {Array.from({ length: metadata.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              )
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === metadata.totalPages}
              dir="rtl"
            >
              التالي
            </Button>
          </div>
        </div>
      )}
    </div>
      </Suspense>
  );
}