"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import TeacherProfileEditor from "@/components/teacher/TeacherProfileEditor";
import { Teacher } from "@/types";
import { showSuccess, showError } from "@/utils/toast";

export default function TeacherProfilePage() {
  const { data: session } = useSession();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchTeacherProfile = async () => {
      // Don't try to fetch if we don't have a session yet
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Add a timeout to prevent rapid requests during development
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        // Fetch the teacher profile with fetch options
        const response = await fetch(`/api/users/${session.user.id}`, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch teacher profile: ${response.status}`);
        }
        const data = await response.json();
        console.log("Teacher profile data:", data);
        
        if (data.teacherProfile) {
          setTeacher(data.teacherProfile);
        } else if (data.user && data.user.teacherProfile) {
          setTeacher(data.user.teacherProfile);
        } else {
          // If user doesn't have a teacher profile yet, create a new one
          console.warn("No teacher profile found, you may need to create one");
          setTeacher(null);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          setError("Request timed out. Please try again.");
        } else {
          setError(err.message || "An error occurred while fetching your profile");
          console.error("Error fetching teacher profile:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherProfile();
  }, [session]);

  const handleSaveProfile = async (updatedTeacher: Teacher) => {
    try {
      if (!teacher?.id) {
        throw new Error("No teacher profile found");
      }
      
      // Update the teacher profile
      const response = await fetch(`/api/teachers/${teacher.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTeacher),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }
      
      const data = await response.json();
      setTeacher(data.profile);
      showSuccess("تم حفظ الملف الشخصي بنجاح");
      
      return data.profile;
    } catch (err: any) {
      showError(err.message || "فشل في حفظ الملف الشخصي");
      console.error("Error saving teacher profile:", err);
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white" dir="rtl">تعديل الملف الشخصي</h1>
      </div>
      
      <div className="p-1">
        <TeacherProfileEditor teacher={teacher as Teacher} onSave={handleSaveProfile} />
      </div>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md" dir="rtl">
        <h3 className="font-bold text-yellow-800 dark:text-yellow-300 text-lg mb-2">ملاحظة مهمة</h3>
        <p className="text-yellow-700 dark:text-yellow-400">
          بعد تحديث ملفك الشخصي، سيتم مراجعته من قبل الإدارة. قد يستغرق ذلك ١-٢ يوم عمل.
          يرجى التأكد من أن جميع المعلومات صحيحة ودقيقة.
        </p>
      </div>
    </div>
  );
}