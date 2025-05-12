"use client";

import React from "react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FaChalkboardTeacher } from "@/components/ui/Icons";
import { Teacher } from "@/types";

interface TeacherApproachProps {
  teacher: Teacher;
}

const TeacherApproach: React.FC<TeacherApproachProps> = ({ teacher }) => {
  if (!teacher.teachingApproach) return null;

  return (
    <Section spacing="small">
      <div className="flex items-center gap-2 mb-4">
        <FaChalkboardTeacher
          className="text-emerald-600 dark:text-emerald-400"
          size={24}
        />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          أسلوب التعليم
        </h2>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <p className="text-gray-700 dark:text-gray-300">{teacher.teachingApproach}</p>
      </div>
    </Section>
  );
};

export default React.memo(TeacherApproach);
