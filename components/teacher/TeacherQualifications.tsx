"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { FaUserGraduate, FaCertificate } from "@/components/ui/Icons";
import { Teacher } from "@/types";

interface QualificationsProps {
  teacher: Teacher;
}

const TeacherQualifications: React.FC<QualificationsProps> = ({ teacher }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Education */}
      <Card variant="bordered">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaUserGraduate className="text-emerald-600 dark:text-emerald-400 ml-2" />
            التعليم
          </h3>
          <div className="text-gray-700 dark:text-gray-300">
            {teacher.education || "بكالوريوس في الدراسات الإسلامية"}
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card variant="bordered">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaCertificate className="text-emerald-600 dark:text-emerald-400 ml-2" />
            الشهادات والإجازات
          </h3>
          {teacher.certifications ? (
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              {teacher.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-700 dark:text-gray-300">
              إجازة في القراءات القرآنية
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(TeacherQualifications);
