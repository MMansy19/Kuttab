"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { FaLanguage, FaTrophy } from "@/components/ui/Icons";
import { Teacher } from "@/types";

interface AchievementsProps {
  teacher: Teacher;
}

const TeacherAchievements: React.FC<AchievementsProps> = ({ teacher }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Languages */}
      <Card variant="bordered">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaLanguage className="text-emerald-600 dark:text-emerald-400 ml-2" />
            اللغات
          </h3>
          {teacher.languages ? (
            <div className="flex flex-wrap gap-2">
              {teacher.languages.map((language, index) => (
                <span
                  key={index}
                  className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-sm"
                >
                  {language}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-gray-700 dark:text-gray-300">العربية</div>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card variant="bordered">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaTrophy className="text-emerald-600 dark:text-emerald-400 ml-2" />
            الإنجازات
          </h3>
          {teacher.achievements ? (
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              {teacher.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-700 dark:text-gray-300">
              تدريس مئات الطلاب بنجاح
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(TeacherAchievements);
