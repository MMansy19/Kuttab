"use client";

import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp, FaBook, FaGraduationCap, FaUserFriends } from 'react-icons/fa';
import Link from 'next/link';
import IconWrapper from './ui/IconWrapper';

// Footer links configuration
const footerLinks = [
  {
    title: "روابط سريعة",
    links: [
      { text: "الرئيسية", href: "/" },
      { text: "عن المنصة", href: "/about" },
      { text: "المعلمون", href: "/teachers" },
      { text: "اتصل بنا", href: "/contact" }
    ]
  },
  {
    title: "المواد التعليمية",
    links: [
      { text: "القرآن الكريم", href: "#" },
      { text: "التجويد", href: "#" },
      { text: "القراءات", href: "#" },
      { text: "علوم القرآن", href: "#" }
    ]
  }
];

const socialLinks = [
  { icon: <FaFacebook size={20} />, href: "#", label: "Facebook", color: "text-blue-600" },
  { icon: <FaTwitter size={20} />, href: "#", label: "Twitter", color: "text-blue-400" },
  { icon: <FaInstagram size={20} />, href: "#", label: "Instagram", color: "text-pink-600" },
  { icon: <FaYoutube size={20} />, href: "#", label: "Youtube", color: "text-red-600" },
  { icon: <FaWhatsapp size={20} />, href: "#", label: "Whatsapp", color: "text-green-500" }
];

const SocialIcon = ({ icon, href, label, color }: { icon: React.ReactNode, href: string, label: string, color: string }) => (
  <Link
    href={href}
    aria-label={label}
    className={`${color} hover:text-emerald-500 transition-colors flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md`}
  >
    <IconWrapper>
      {icon}
    </IconWrapper>
  </Link>
);

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 text-emerald-900 dark:text-white border-t border-accent py-12 mt-16 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          {/* Logo and About section */}
          <div className="mb-8 md:mb-0 md:w-1/3">
            <div className="flex items-center mb-4">
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 inline-block text-transparent bg-clip-text">
                  <span>كُتّاب <span className="text-emerald-700 dark:text-emerald-400 opacity-30 mx-1">|</span> <span dir="ltr" className="inline-block">iKuttab</span></span>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">منصة تعليمية عربية</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              منصة كُتّاب التعليمية هي منصة متخصصة في تعليم القرآن الكريم والعلوم الإسلامية، تهدف إلى توفير تعليم نوعي بأيدي نخبة من المعلمين المتخصصين
            </p>

            <div className="flex space-x-4">
              <div className="flex gap-2">
                {socialLinks.map((link, i) => (
                  <SocialIcon key={i} {...link} />
                ))}
              </div>
            </div>
          </div>

          {/* Link sections */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:w-2/3">
            {footerLinks.map((section, i) => (
              <div key={i} className="flex flex-col items-start">
                <h4 className="font-bold text-lg mb-4 text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <IconWrapper>
                    {i === 0 ? <FaBook /> : <FaGraduationCap />}
                  </IconWrapper>
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link href={link.href} className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors duration-200">
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact section */}
            <div className="flex flex-col items-start">
              <h4 className="font-bold text-lg mb-4 text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <IconWrapper>
                  <FaUserFriends />
                </IconWrapper>
                تواصل معنا
              </h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-gray-600 dark:text-gray-400">البريد الإلكتروني:</span>
                  <br />
                  <a
                    href="mailto:info@kottab.com"
                    className="text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    info@kottab.com
                  </a>
                </li>
                <li>
                  <span className="text-gray-600 dark:text-gray-400">الهاتف:</span>
                  <br />
                  <a
                    href="tel:+966123456789"
                    className="text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    +966 12 345 6789
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-right mb-4 md:mb-0">
            <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">اشترك في النشرة البريدية</h4>
            <p className="text-gray-600 dark:text-gray-400">احصل على آخر الأخبار والتحديثات</p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-r-none rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white w-full md:w-auto"
            />
            <button
              className="bg-emerald-600 text-white px-4 py-2 rounded-l-none rounded-r-lg hover:bg-emerald-700 transition-colors duration-200"
            >
              اشتراك
            </button>
          </div>
        </div>

        {/* Copyright section */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-sm flex flex-col md:flex-row items-center justify-between">
          <p>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              كُتّاب
            </span> &copy; {new Date().getFullYear()} جميع الحقوق محفوظة
          </p>
          <div className="flex gap-4 mt-3 md:mt-0">
            <Link href="/privacy" className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400">
              سياسة الخصوصية
            </Link>
            <span className="text-gray-400">|</span>
            <Link href="/terms" className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400">
              شروط الاستخدام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}