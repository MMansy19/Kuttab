"use client";

import React, { useState, useEffect } from 'react';
import TeacherProfileEditor from '@/components/teacher/TeacherProfileEditor';
import { Teacher } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

// This would typically come from an API or auth context
// For the demo, we'll initialize with example data
const mockTeacherData: Teacher = {
  id: "t-1",
  name: "د. خالد المصري",
  bio: "معلم قرآن كريم وتجويد بخبرة أكثر من 15 عاماً في التعليم. حاصل على إجازة في رواية حفص عن عاصم وإجازة في القراءات العشر الصغرى.",
  subjects: ["القرآن الكريم", "التجويد", "القراءات العشر"],
  rating: 4.9,
  experience: 15,
  gender: "male",
  specialization: "القراءات العشر الصغرى",
  isPaid: true,
  price: 150,
  availableSlots: [],
  education: "دكتوراه في علوم القرآن والتفسير",
  certifications: ["إجازة في رواية حفص عن عاصم", "إجازة في القراءات العشر الصغرى"],
  languages: ["العربية", "الإنجليزية"],
  teachingApproach: "أعتمد على الفهم والممارسة المستمرة مع متابعة دقيقة للطلاب",
  contactInfo: {
    email: "khalid@example.com",
    phone: "+966500000000",
    whatsapp: "+966500000000"
  },
  achievements: ["تخريج أكثر من 200 طالب حافظ للقرآن"],
};

export default function TeacherProfilePage() {
  const [teacher, setTeacher] = useState<Teacher>(mockTeacherData);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // In a real app, this would fetch data from an API
  useEffect(() => {
    // Fetch teacher data from API
    // setTeacher(data)
  }, []);

  const handleSaveProfile = async (updatedTeacher: Teacher) => {
    try {
      setIsLoading(true);
      
      // In a real application, this would be an API call to save the teacher data
      console.log("Saving teacher data:", updatedTeacher);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTeacher(updatedTeacher);
      setSaveStatus("success");
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error saving teacher profile:", error);
      setSaveStatus("error");
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الملف الشخصي</h1>
        
        <div className="flex gap-3">
          <Link href="/dashboard/teacher/availability">
            <Button variant="outline" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
              </svg>
              إدارة المواعيد
            </Button>
          </Link>
          
          <Link href={`/teachers/${teacher.id}`} target="_blank">
            <Button variant="outline" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
              عرض صفحتي
            </Button>
          </Link>
        </div>
      </div>
      
      {saveStatus === "success" && (
        <div className="mb-6 p-3 bg-green-100 text-green-800 rounded-md dark:bg-green-900/30 dark:text-green-400">
          تم حفظ الملف الشخصي بنجاح
        </div>
      )}
      
      {saveStatus === "error" && (
        <div className="mb-6 p-3 bg-red-100 text-red-800 rounded-md dark:bg-red-900/30 dark:text-red-400">
          حدث خطأ أثناء حفظ الملف الشخصي، يرجى المحاولة مرة أخرى
        </div>
      )}
      
      <TeacherProfileEditor 
        teacher={teacher} 
        onSave={handleSaveProfile} 
      />
    </div>
  );
}
