"use client";

import { useEffect, useState } from "react";
import { FaDesktop, FaLaptop, FaTabletAlt } from "react-icons/fa";

export default function MobileBlocker({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      // Mobile detection: screen width < 768px (Tailwind's md breakpoint)
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsChecking(false);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Show nothing while checking to avoid flash
  if (isChecking) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-md w-full text-center">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
            {/* Icon */}
            <div className="flex justify-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <FaDesktop className="text-3xl text-blue-400" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <FaLaptop className="text-3xl text-purple-400" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <FaTabletAlt className="text-3xl text-cyan-400" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-cyan-300">
              Desktop Experience Only
            </h1>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed mb-6">
              CodeSensei dirancang khusus untuk pengalaman terbaik di{" "}
              <span className="text-white font-semibold">
                Desktop, Laptop, atau Tablet
              </span>
              .
            </p>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <p className="text-yellow-300 text-sm">
                Fitur interaktif seperti Code Editor, Challenge, dan Chat
                memerlukan layar yang lebih besar untuk pengalaman optimal.
              </p>
            </div>

            {/* Instructions */}
            <div className="text-left space-y-3 mb-6">
              <p className="text-gray-300 text-sm font-medium">
                Untuk mengakses CodeSensei:
              </p>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>Buka dari Desktop atau Laptop</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>Gunakan Tablet dalam mode landscape</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>
                    Minimal ukuran layar 768px (iPad atau lebih besar)
                  </span>
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-gray-500 text-xs">
                Terima kasih atas pengertiannya
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
