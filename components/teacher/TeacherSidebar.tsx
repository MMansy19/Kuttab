"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FaStar } from "@/components/ui/Icons";
import { Teacher } from "@/types";

interface SidebarProps {
  teacher: Teacher;
  availableSlotsCount: number;
  onBookingClick: () => void;
  onContactClick: () => void;
  showContactInfo: boolean;
}

const TeacherSidebar: React.FC<SidebarProps> = ({
  teacher,
  availableSlotsCount,
  onBookingClick,
  onContactClick,
  showContactInfo,
}) => {
  return (
    <Card variant="bordered" className="sticky top-4">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {teacher.isPaid ? "سعر الجلسة" : "جلسة مجانية"}
          </h3>
          {teacher.isPaid ? (
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {teacher.price} ريال/ساعة
            </div>
          ) : (
            <div className="text-xl text-emerald-600 dark:text-emerald-400">
              هذا المعلم يقدم جلسات مجانية
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Booking button */}
          {availableSlotsCount > 0 ? (
            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={onBookingClick}
            >
              حجز موعد
            </Button>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              disabled
            >
              لا تتوفر مواعيد حالياً
            </Button>
          )}

          {/* Contact button */}
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onContactClick}
          >
            تواصل مع المعلم
          </Button>
        </div>

        {/* Contact info section */}
        {showContactInfo && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">
              معلومات التواصل
            </h4>
            {teacher.contactInfo ? (
              <TeacherContactInfo contactInfo={teacher.contactInfo} />
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
                <p className="text-yellow-800 dark:text-yellow-300">
                  لا تتوفر معلومات الاتصال لهذا المعلم حالياً
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                  يمكنك التسجيل وحجز جلسة مع المعلم للتواصل معه
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick details */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <ul className="space-y-3">
            <li className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">المواد</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {teacher.subjects.length} مادة
              </span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">الخبرة</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {teacher.experience} سنة
              </span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">التخصص</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {teacher.specialization}
              </span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">التقييم</span>
              <span className="text-yellow-500 font-medium flex items-center">
                <FaStar className="ml-1" />
                {teacher.rating.toFixed(1)}
              </span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">انضم في</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {teacher.joinedDate
                  ? new Date(teacher.joinedDate).toLocaleDateString("ar-SA")
                  : "غير معروف"}
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Nested component for contact info
const TeacherContactInfo = ({ contactInfo }: { contactInfo: any }) => {
  const { email, phone, whatsapp, telegram } = contactInfo;

  return (
    <div className="space-y-3">
      {email && (
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span dir="ltr">{email}</span>
        </a>
      )}

      {phone && (
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <span dir="ltr">{phone}</span>
        </a>
      )}

      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
        >
          <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
          </svg>
          <span dir="ltr">{whatsapp}</span>
        </a>
      )}

      {telegram && (
        <a
          href={`https://t.me/${telegram.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
        >
          <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
            <path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z" />
          </svg>
          <span dir="ltr">{telegram}</span>
        </a>
      )}
    </div>
  );
};

export default React.memo(TeacherSidebar);
