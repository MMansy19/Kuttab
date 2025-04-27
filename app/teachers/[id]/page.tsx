"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  FaUserGraduate, 
  FaStar, 
  FaClock, 
  FaEnvelope, 
  FaPhone, 
  FaWhatsapp, 
  FaTelegram, 
  FaCalendarAlt, 
  FaGraduationCap, 
  FaCertificate, 
  FaLanguage, 
  FaTrophy, 
  FaChalkboardTeacher
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import teachersData from "@/data/teachers";
import type { Teacher } from "@/types";

export default function TeacherProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [selectedWeek, setSelectedWeek] = useState<string>(""); 
  const [showContactInfo, setShowContactInfo] = useState<boolean>(false);

  // Find teacher by id param
  const teacher = teachersData.find((t) => t.id === params.id);
  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
        <div className="text-red-500 text-5xl mb-4">😢</div>
        <h2 className="text-2xl font-bold text-red-500 mb-2">المعلم غير موجود</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">لم نتمكن من العثور على بيانات المعلم المطلوب</p>
        <Button onClick={() => router.push("/teachers")}>
          العودة لقائمة المعلمين
        </Button>
      </div>
    );
  }

  // Group availableSlots by week (ISO week)
  const slotsByWeek: Record<string, string[]> = {};
  teacher.availableSlots?.forEach((slot) => {
    const date = new Date(slot.replace(" ", "T"));
    // Get ISO week string: yyyy-Www
    const week = `${date.getFullYear()}-W${String(
      Math.ceil(
        ((date - new Date(date.getFullYear(), 0, 1)) / 86400000 +
          new Date(date.getFullYear(), 0, 1).getDay() +
          1) /
          7
      )
    ).padStart(2, "0")}`;
    if (!slotsByWeek[week]) slotsByWeek[week] = [];
    slotsByWeek[week].push(slot);
  });

  const weekKeys = Object.keys(slotsByWeek);
  
  // Initialize selected week if not set
  if (selectedWeek === "" && weekKeys.length > 0) {
    setSelectedWeek(weekKeys[0]);
  }

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
    setShowContactInfo(!showContactInfo);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero section with teacher name and image */}
      <div className="relative bg-gradient-to-r from-emerald-800 to-blue-800 text-white">
        <div className="absolute inset-0 bg-[url('/images/islamic-pattern.svg')] opacity-10"></div>
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
                  <FaStar className="text-yellow-400 mr-1" />
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

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* About section */}
            <Section spacing="medium">
              <SectionHeader title="نبذة عن المعلم" />
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-right">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {teacher.bio}
                </p>
              </div>
            </Section>

            {/* Teaching approach */}
            {teacher.teachingApproach && (
              <Section spacing="medium">
                <div className="flex items-center gap-2 mb-4">
                  <FaChalkboardTeacher className="text-emerald-600 dark:text-emerald-400" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    أسلوب التعليم
                  </h2>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    {teacher.teachingApproach}
                  </p>
                </div>
              </Section>
            )}

            {/* Qualifications */}
            <Section spacing="medium">
              <div className="flex items-center gap-2 mb-4">
                <FaGraduationCap className="text-emerald-600 dark:text-emerald-400" size={24} />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  المؤهلات العلمية
                </h2>
              </div>
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
            </Section>

            {/* Languages & Achievements */}
            <Section spacing="medium">
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
            </Section>

            {/* Available slots section */}
            <Section spacing="medium">
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
                      {selectedWeek && slotsByWeek[selectedWeek]?.map((slot) => (
                        <div
                          key={slot}
                          className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center text-emerald-800 dark:text-emerald-300">
                              <FaClock className="mr-2" />
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing card */}
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
                  {weekKeys.length > 0 ? (
                    <Button
                      variant="gradient"
                      size="lg"
                      className="w-full"
                      onClick={() => router.push(`/book/${teacher.id}`)}
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
                    onClick={handleContactTeacher}
                  >
                    تواصل مع المعلم
                  </Button>
                </div>

                {/* Contact info section */}
                {showContactInfo && teacher.contactInfo && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">
                      معلومات التواصل
                    </h4>
                    <div className="space-y-3">
                      {teacher.contactInfo.email && (
                        <a
                          href={`mailto:${teacher.contactInfo.email}`}
                          className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                          <FaEnvelope className="text-emerald-600 dark:text-emerald-400" />
                          <span dir="ltr">{teacher.contactInfo.email}</span>
                        </a>
                      )}

                      {teacher.contactInfo.phone && (
                        <a
                          href={`tel:${teacher.contactInfo.phone}`}
                          className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                          <FaPhone className="text-emerald-600 dark:text-emerald-400" />
                          <span dir="ltr">{teacher.contactInfo.phone}</span>
                        </a>
                      )}

                      {teacher.contactInfo.whatsapp && (
                        <a
                          href={`https://wa.me/${teacher.contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                          <FaWhatsapp className="text-emerald-600 dark:text-emerald-400" />
                          <span dir="ltr">{teacher.contactInfo.whatsapp}</span>
                        </a>
                      )}

                      {teacher.contactInfo.telegram && (
                        <a
                          href={`https://t.me/${teacher.contactInfo.telegram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                          <FaTelegram className="text-emerald-600 dark:text-emerald-400" />
                          <span dir="ltr">{teacher.contactInfo.telegram}</span>
                        </a>
                      )}
                    </div>
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
                        {new Date(teacher.joinedDate).toLocaleDateString("ar-SA")}
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Related teachers section (can be implemented later) */}
          </div>
        </div>
      </div>
    </div>
  );
}