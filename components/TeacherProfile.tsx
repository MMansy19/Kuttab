"use client";

import React, { useState } from 'react';
import { FaUserCircle, FaStar, FaClock, FaCalendarAlt, FaPlayCircle, FaGraduationCap, FaCoins } from 'react-icons/fa';
import type { Teacher } from '../types';
import { motion } from '@/utils/framer-motion';
import IconWrapper from './ui/IconWrapper';

interface TeacherProfileProps {
  teacher: Teacher & {
    experience?: number;
    isPaid?: boolean;
    price?: number;
    videoUrl?: string;
  };
}

const TeacherAvatar: React.FC<{ avatarUrl?: string; name: string }> = ({ avatarUrl, name }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    className="relative"
  >
    {avatarUrl ? (
      <img
        src={avatarUrl}
        alt={name}
        className="w-24 h-24 rounded-full border-2 border-emerald-300 dark:border-emerald-700 object-cover bg-gray-100 dark:bg-gray-900"
      />
    ) : (
      <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
        <FaUserCircle className="w-16 h-16 text-emerald-500 dark:text-emerald-400" />
      </div>
    )}
    <motion.div 
      className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full w-8 h-8 flex items-center justify-center text-white border-2 border-white dark:border-gray-800"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, type: "spring" }}
    >
      <FaGraduationCap />
    </motion.div>
  </motion.div>
);

const TeacherProfile: React.FC<TeacherProfileProps> = ({ teacher }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-lg p-8 flex flex-col gap-4 transition-all duration-300 max-w-2xl mx-auto mt-8 border border-gray-200 dark:border-gray-700 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile Header with Background */}
      <div className="relative -mt-8 -mx-8 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 opacity-90"></div>
        <div className="bg-[url('/images/islamic-pattern.png')] bg-repeat opacity-10 absolute inset-0"></div>
        <div className="relative px-8 pt-12 pb-6">
          <div className="flex items-start gap-6 relative">
            <TeacherAvatar avatarUrl={teacher.avatarUrl} name={teacher.name} />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white">{teacher.name}</h2>
              <motion.div 
                className="flex flex-wrap gap-2 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {teacher.subjects?.map((subject, idx) => (
                  <motion.span 
                    key={subject}
                    className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                  >
                    {subject}
                  </motion.span>
                ))}
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.span
                      key={star}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + (star * 0.1) }}
                    >
                      <IconWrapper animate={star <= Math.round(teacher.rating || 0) ? "pulse" : "none"} size="sm">
                        <FaStar className={`${star <= Math.round(teacher.rating || 0) ? 'text-yellow-400' : 'text-white/40'}`} />
                      </IconWrapper>
                    </motion.span>
                  ))}
                </div>
                <span className="text-white/80">({teacher.rating?.toFixed(1) ?? '0.0'})</span>
              </motion.div>
            </motion.div>

            <motion.div 
              className="ml-auto mt-2 flex flex-col items-end"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {teacher.experience !== undefined && (
                <motion.div 
                  className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 text-white flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <span>{teacher.experience} سنة</span>
                  <IconWrapper animate="bounce" size="sm">
                    <FaClock />
                  </IconWrapper>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <motion.div 
        className="text-gray-800 dark:text-gray-200 text-right leading-loose bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <span>نبذة عن المعلم</span>
        </h3>
        <p>{teacher.bio}</p>
      </motion.div>

      {/* Pricing and Info Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.div 
          className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="bg-emerald-600 px-4 py-2 text-white font-semibold flex items-center gap-2">
            <IconWrapper animate="bounce">
              <FaCoins />
            </IconWrapper>
            <span>نوع الحساب</span>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <span>نوع الحساب:</span>
              <motion.span 
                className={`px-3 py-1 rounded-full ${
                  teacher.isPaid 
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300" 
                    : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {teacher.isPaid ? 'مدفوع' : 'مجاني'}
              </motion.span>
            </div>
            {teacher.isPaid && teacher.price !== undefined && (
              <div className="flex items-center justify-between mt-3">
                <span>السعر لكل ساعة:</span>
                <motion.span 
                  className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                  whileHover={{ scale: 1.05 }}
                >
                  {teacher.price} ريال
                </motion.span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="bg-blue-600 px-4 py-2 text-white font-semibold flex items-center gap-2">
            <IconWrapper animate="pulse">
              <FaCalendarAlt />
            </IconWrapper>
            <span>الأوقات المتاحة</span>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800">
            <ul className="space-y-2">
              {teacher.availableSlots?.length === 0 ? (
                <li className="text-gray-500 dark:text-gray-400">لا يوجد أوقات متاحة حالياً</li>
              ) : (
                teacher.availableSlots?.map((slot, index) => (
                  <motion.li 
                    key={slot}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                  >
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span>{slot}</span>
                  </motion.li>
                ))
              )}
            </ul>
          </div>
        </motion.div>
      </motion.div>

      {/* Video Section */}
      {teacher.videoUrl ? (
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
            <IconWrapper animate="pulse" color="text-emerald-600 dark:text-emerald-500">
              <FaPlayCircle />
            </IconWrapper>
            <span>فيديو تعريفي</span>
          </h3>
          <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-900">
            <video 
              controls 
              className="w-full rounded"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            >
              <source src={teacher.videoUrl} type="video/mp4" />
              متصفحك لا يدعم تشغيل الفيديو.
            </video>
            {!isVideoPlaying && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                <motion.button 
                  className="w-16 h-16 bg-emerald-600/90 rounded-full flex items-center justify-center text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const video = document.querySelector('video');
                    if (video) {
                      video.play();
                    }
                  }}
                >
                  <FaPlayCircle size={32} />
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center bg-gray-50 dark:bg-gray-800/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <IconWrapper animate="pulse" size="lg" className="mx-auto mb-2 text-gray-400">
            <FaPlayCircle />
          </IconWrapper>
          <p className="text-gray-500 dark:text-gray-400">لا يوجد فيديو تعريفي لهذا المعلم</p>
        </motion.div>
      )}
      
      {/* Book Button */}
      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <motion.button
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transform transition duration-200"
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)" }}
          whileTap={{ scale: 0.95 }}
        >
          احجز درساً الآن
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default TeacherProfile;