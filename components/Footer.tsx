import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 text-emerald-900 dark:text-white border-t border-accent py-8 mt-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 mr-3 relative">
              <Image 
                src="/images/logo.svg" 
                alt="كُتّاب"
                width={48}
                height={48}
                priority
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-accent">كُتّاب | KOTTAB</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">منصة تعليمية عربية</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-4 mb-2">
              <Link href="#" aria-label="Facebook" className="text-gray-500 hover:text-accent transition-colors">
                <FaFacebook size={24} />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-gray-500 hover:text-accent transition-colors">
                <FaTwitter size={24} />
              </Link>
              <Link href="#" aria-label="Instagram" className="text-gray-500 hover:text-accent transition-colors">
                <FaInstagram size={24} />
              </Link>
              <Link href="#" aria-label="Youtube" className="text-gray-500 hover:text-accent transition-colors">
                <FaYoutube size={24} />
              </Link>
              <Link href="#" aria-label="Whatsapp" className="text-gray-500 hover:text-accent transition-colors">
                <FaWhatsapp size={24} />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 py-4 text-center text-sm">
          <span className="text-accent font-bold">كُتّاب</span> &copy; {new Date().getFullYear()} جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}