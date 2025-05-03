"use client";
import type { Teacher } from '../types';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaEye, FaCalendarCheck, FaStar, FaQuran, FaUserGraduate } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { 
  motion, 
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
  MotionConfig
} from '@/utils/framer-motion';
import IconWrapper from './ui/IconWrapper';

interface TeacherCardProps {
  teacher: Teacher;
  onBook?: (id: string) => void;
  index?: number;
}

export default function TeacherCard({ teacher, onBook, index = 0 }: TeacherCardProps) {
  const router = useRouter();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleViewProfile = () => {
    setLoadingProfile(true);
    router.push(`/teachers/${teacher.id}`);
    // No need to reset loading state as we're navigating away
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingBooking(true);
    
    if (onBook) {
      try {
        onBook(teacher.id);
      } finally {
        setLoadingBooking(false);
      }
    } else {
      router.push(`/book/${teacher.id}`);
      // No need to reset loading state as we're navigating away
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: index * 0.1, 
        ease: "easeOut" 
      }}
      whileHover={{ 
        y: -5, 
        transition: { duration: 0.2 } 
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-lg p-6 flex flex-col gap-3 items-start w-full max-w-sm mx-auto transition-all duration-300 border border-gray-200 dark:border-gray-700 relative hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700"
    >
      <div className="flex items-center gap-4 w-full relative">
        {teacher.avatarUrl ? (
          <motion.div 
            className="w-16 h-16 rounded-full border-2 border-emerald-300 dark:border-emerald-700 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            animate={isHovered ? { borderColor: "#059669" } : {}}
          >
            <Image
              src={teacher.avatarUrl}
              alt={teacher.name}
              width={64}
              height={64}
              className="object-cover bg-gray-100 dark:bg-gray-900"
            />
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"
          >
            <FaUserCircle className="w-12 h-12 text-emerald-500 dark:text-emerald-400" />
          </motion.div>
        )}
        <div>
          <motion.h3 
            className="text-xl font-bold"
            animate={isHovered ? { color: "#059669" } : {}}
            transition={{ duration: 0.3 }}
          >
            {teacher.name}
          </motion.h3>
          <div className="flex items-center gap-3">
            <p className="text-emerald-700 dark:text-emerald-300 text-sm mt-[2px]">{teacher.experience} سنوات خبرة</p>
            <motion.div 
              className="flex items-center text-yellow-500 dark:text-yellow-400"
              whileHover={{ scale: 1.1 }}
            >
              <IconWrapper animate="pulse" size="sm">
                <FaStar className="h-4 w-4 ml-1" />
              </IconWrapper>
              <span className="font-bold">{teacher.rating?.toFixed(1) ?? '0.0'}</span>
            </motion.div>
          </div>
          {teacher.specialization && (
            <motion.div 
              className="flex items-center mt-1 gap-1 text-blue-600 dark:text-blue-400 text-sm"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <IconWrapper animate="bounce" size="sm">
                <FaUserGraduate className="h-3 w-3 ml-1" />
              </IconWrapper>
              <span>{teacher.specialization}</span>
            </motion.div>
          )}
        </div>
      </div>
      <motion.p 
        className="mt-2 text-gray-700 dark:text-gray-300 text-sm line-clamp-2"
        animate={isHovered ? { opacity: 1 } : { opacity: 0.9 }}
      >
        {teacher.bio}
      </motion.p>
      
      <motion.div 
        className="flex flex-wrap gap-2 mt-2"
        initial={{ opacity: 0.9 }}
        animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        {teacher.subjects?.map((subject, idx) => (
          <motion.span 
            key={subject} 
            className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center"
            whileHover={{ 
              scale: 1.05, 
              backgroundColor: "rgba(5, 150, 105, 0.2)",
              transition: { duration: 0.2 }
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + (idx * 0.05) }}
          >
            <IconWrapper animate={isHovered ? "bounce" : "none"} size="sm">
              <FaQuran className="ml-1 h-3 w-3" />
            </IconWrapper>
            {subject}
          </motion.span>
        ))}
      </motion.div>
      
      <div className="w-full flex gap-3 mt-auto sm:flex-col flex-row">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
            loadingProfile ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
          } focus:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-70`}
          onClick={handleViewProfile}
          disabled={loadingProfile || loadingBooking}
        >
          {loadingProfile ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
              جاري التحميل
            </>
          ) : (
            <>
              <IconWrapper animate="none">
                <FaEye />
              </IconWrapper>
              عرض الملف
            </>
          )}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
            loadingBooking ? 'bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700'
          } focus:bg-emerald-700 text-white font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-70`}
          onClick={handleBookClick}
          disabled={loadingProfile || loadingBooking}
        >
          {loadingBooking ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
              جاري الحجز
            </>
          ) : (
            <>
              <IconWrapper animate="none">
                <FaCalendarCheck />
              </IconWrapper>
              احجز الآن
            </>
          )}
        </motion.button>
      </div>
      
      {teacher.isPaid && (
        <motion.div 
          className="absolute top-2 left-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          whileHover={{ scale: 1.1, y: -2 }}
        >
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2.5 py-1 rounded shadow-sm">
            {teacher.price} ريال
          </span>
        </motion.div>
      )}
      {!teacher.isPaid && (
        <motion.div 
          className="absolute top-2 left-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          whileHover={{ scale: 1.1, y: -2 }}
        >
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2.5 py-1 rounded shadow-sm">
            مجاني
          </span>
        </motion.div>
      )}
      
      <Link href={`/book/${teacher.id}`} prefetch={true} className="hidden" />
      <Link href={`/teachers/${teacher.id}`} prefetch={true} className="hidden" />
    </motion.div>
  );
}