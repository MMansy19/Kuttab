"use client";

import React, { useState, Suspense, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FaGraduationCap } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import ErrorBoundary from "@/components/ErrorBoundary";
import teachersData from "@/data/teachers";

// Import the TeacherHero component normally since it's above the fold
import TeacherHero from "@/components/teacher/TeacherHero";

// Dynamically import the other components with lazy loading
const TeacherBio = dynamic(() => import("@/components/teacher/TeacherBio"), {
  loading: () => <LoadingSection height="sm" />,
  ssr: false,
});

const TeacherApproach = dynamic(() => import("@/components/teacher/TeacherApproach"), {
  loading: () => <LoadingSection height="sm" />,
  ssr: false,
});

const TeacherQualifications = dynamic(() => import("@/components/teacher/TeacherQualifications"), {
  loading: () => <LoadingSection height="md" />,
  ssr: false,
});

const TeacherAchievements = dynamic(() => import("@/components/teacher/TeacherAchievements"), {
  loading: () => <LoadingSection height="md" />,
  ssr: false,
});

const TeacherAvailableSlots = dynamic(() => import("@/components/teacher/TeacherAvailableSlots"), {
  loading: () => <LoadingSection height="lg" />,
  ssr: false,
});

const TeacherSidebar = dynamic(() => import("@/components/teacher/TeacherSidebar"), {
  loading: () => <LoadingSection height="xl" />,
  ssr: false,
});

// Loading placeholder component
const LoadingSection = ({ height = "md" }: { height?: "sm" | "md" | "lg" | "xl" }) => {
  const heights = {
    sm: "h-32",
    md: "h-48",
    lg: "h-64",
    xl: "h-96"
  };

  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${heights[height]} mb-6`}></div>
  );
};

export default function TeacherProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [showContactInfo, setShowContactInfo] = useState<boolean>(false);
  // Find teacher by id param using useMemo to prevent unnecessary re-computation
  const teacherId = params?.id as string;
  const teacher = useMemo(() => 
    teachersData.find((t) => t.id === teacherId), 
    [teacherId]
  );
  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
        <div className="text-red-500 text-5xl mb-4">😢</div>
        <h2 className="text-2xl font-bold text-red-500 mb-2">المعلم غير موجود</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">لم نتمكن من العثور على بيانات المعلم المطلوب</p>
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors"
          onClick={() => router.push("/teachers")}
        >
          العودة لقائمة المعلمين
        </button>
      </div>
    );
  }

  const handleBooking = () => {
    router.push(`/book/${teacher.id}`);
  };

  const handleContactTeacher = () => {
    setShowContactInfo(!showContactInfo);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero section with teacher name and image */}
      <ErrorBoundary>
        <TeacherHero teacher={teacher} />
      </ErrorBoundary>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <ErrorBoundary>
              <Suspense fallback={<LoadingSection height="sm" />}>
                <TeacherBio teacher={teacher} />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<LoadingSection height="sm" />}>
                <TeacherApproach teacher={teacher} />
              </Suspense>
            </ErrorBoundary>

            {/* Qualifications */}
            <ErrorBoundary>
              <Section spacing="small">
                <div className="flex items-center gap-2 mb-4">
                  <FaGraduationCap className="text-emerald-600 dark:text-emerald-400" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    المؤهلات العلمية
                  </h2>
                </div>

                <Suspense fallback={<LoadingSection height="md" />}>
                  <TeacherQualifications teacher={teacher} />
                </Suspense>
              </Section>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<LoadingSection height="md" />}>
                <TeacherAchievements teacher={teacher} />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<LoadingSection height="lg" />}>
                <TeacherAvailableSlots teacher={teacher} />
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ErrorBoundary>
              <Suspense fallback={<LoadingSection height="xl" />}>
                <TeacherSidebar
                  teacher={teacher}
                  availableSlotsCount={teacher.availableSlots.length}
                  onBookingClick={handleBooking}
                  onContactClick={handleContactTeacher}
                  showContactInfo={showContactInfo}
                />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}
