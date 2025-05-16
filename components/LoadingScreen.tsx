// components/LoadingScreen.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => setIsVisible(false), 300);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`
      fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 transition-opacity duration-300
      ${isExiting ? "opacity-0 pointer-events-none" : ""}
    `}>
            <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 p-2 backdrop-blur-sm animate-pulse">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                            src="/images/icon-192x192.png"
                            alt="iKuttab Logo"
                            width={80}
                            height={80}
                            priority
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                        />
                    </div>
                </div>
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-blue-600 inline-block text-transparent bg-clip-text">
                    <span>منصة كُتّاب<span className="text-emerald-700 dark:text-emerald-400 opacity-30 mx-1">|</span> <span dir="ltr" className="inline-block">iKuttab</span></span>
                </h2>
            </div>
        </div>
    );
}