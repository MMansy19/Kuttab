"use client";

import React, { useState, useMemo } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FaCalendarAlt, FaClock } from "@/components/ui/Icons";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Teacher } from "@/types";

interface AvailableSlotsProps {
  teacher: Teacher;
}

const TeacherAvailableSlots: React.FC<AvailableSlotsProps> = ({ teacher }) => {
  const router = useRouter();
  const [selectedWeek, setSelectedWeek] = useState<string>("");

  // Group availableSlots by week (ISO week) - Memoized for performance
  const slotsByWeek = useMemo(() => {
    const groupedSlots: Record<string, string[]> = {};
    
    teacher.availableSlots?.forEach((slot) => {
      const date = new Date(slot.replace(" ", "T"));
      // Fix the arithmetic operation by using proper number types
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor(
        (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
      );
      const weekNum = Math.ceil((days + startOfYear.getDay() + 1) / 7);

      // Get ISO week string: yyyy-Www
      const week = `${date.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
      if (!groupedSlots[week]) groupedSlots[week] = [];
      groupedSlots[week].push(slot);
    });
    
    return groupedSlots;
  }, [teacher.availableSlots]);

  // Get array of week keys
  const weekKeys = Object.keys(slotsByWeek);

  // Initialize selected week if not set
  React.useEffect(() => {
    if (selectedWeek === "" && weekKeys.length > 0) {
      setSelectedWeek(weekKeys[0]);
    }
  }, [weekKeys, selectedWeek]);

  // Format date for display
  const formatSlotDate = (slot: string) => {
    const date = new Date(slot.replace(" ", "T"));
    return new Intl.DateTimeFormat("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const handleBookSlot = (slot: string) => {
    router.push(`/book/${teacher.id}?slot=${encodeURIComponent(slot)}`);
  };

  const handleContactTeacher = () => {
    router.push(`/contact?teacherId=${teacher.id}`);
  };

  return (
    <Section spacing="small">
      <div className="flex items-center gap-2 mb-4">
        <FaCalendarAlt className="text-emerald-600 dark:text-emerald-400" size={24} />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          المواعيد المتاحة
        </h2>
      </div>

      {weekKeys.length > 0 ? (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                اختر الأسبوع لعرض المواعيد المتاحة:
              </label>
              <select
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
              >
                {weekKeys.map((week) => (
                  <option key={week} value={week}>
                    {week}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedWeek &&
                slotsByWeek[selectedWeek]?.map((slot) => (
                  <div
                    key={slot}
                    className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center text-emerald-800 dark:text-emerald-300">
                        <FaClock className="ml-2" />
                        <span>{formatSlotDate(slot)}</span>
                      </div>
                    </div>
                    <Button
                      variant="gradient"
                      className="w-full"
                      onClick={() => handleBookSlot(slot)}
                    >
                      حجز هذا الموعد
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
          <p className="text-yellow-800 dark:text-yellow-300 text-lg">
            لا تتوفر مواعيد حالياً لهذا المعلم
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={handleContactTeacher}
          >
            تواصل مع المعلم للاستفسار
          </Button>
        </div>
      )}
    </Section>
  );
};

export default React.memo(TeacherAvailableSlots);
