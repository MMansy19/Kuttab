"use client";

import React from "react";
import { Section } from "@/components/ui/Section";
import { Teacher } from "@/types";

interface TeacherBioProps {
  teacher: Teacher;
}

const TeacherBio: React.FC<TeacherBioProps> = ({ teacher }) => {
  return (
    <Section spacing="small">
      <SectionHeader title="نبذة عن المعلم" />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-right">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
          {teacher.bio}
        </p>
      </div>
    </Section>
  );
};

// Separate SectionHeader component for better reusability
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{title}</h2>
);

export default React.memo(TeacherBio);
