"use client";

import React, { memo } from "react";
import { FaStar } from "@/components/ui/Icons";
import Image from "next/image";
import { Teacher } from "@/types";
import OptimizedPatternBackground from '@/components/performance/OptimizedPatternBackground';

interface TeacherHeroProps {
  teacher: Teacher;
}

// Memoized TeacherHero component to prevent unnecessary re-renders
const TeacherHero: React.FC<TeacherHeroProps> = memo(({ teacher }) => {
  return (
    <div className="relative bg-gradient-to-r from-emerald-800 to-blue-800 text-white">
      <OptimizedPatternBackground  />
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 text-center md:text-right">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{teacher.name}</h1>
            <p className="text-xl text-emerald-100 mb-6">
              {teacher.specialization} • {teacher.experience} سنة خبرة
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              {teacher.subjects.map((subject) => (
                <span
                  key={subject}
                  className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm"
                >
                  {subject}
                </span>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center md:justify-start gap-2">
              <div className="bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                <FaStar className="text-yellow-400 ml-1" />
                <span className="font-bold">{teacher.rating.toFixed(1)}</span>
              </div>
              <span className="text-emerald-100">
                متاح {teacher.availableSlots.length} موعد
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="w-48 h-48 md:w-64 md:h-64 relative overflow-hidden rounded-full border-4 border-white/30">
              {teacher.avatarUrl ? (
                <Image
                  src={teacher.avatarUrl}
                  alt={teacher.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 192px, 256px"
                  loading="eager" // Load hero image eagerly as it's above the fold
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-700 text-white text-6xl">
                  {teacher.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-emerald-600 px-4 py-1 rounded-full text-sm font-medium">
              {teacher.gender === "male" ? "معلم" : "معلمة"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Add displayName for better debugging
TeacherHero.displayName = 'TeacherHero';

export default TeacherHero;
