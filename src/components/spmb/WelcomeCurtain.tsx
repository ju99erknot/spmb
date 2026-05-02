"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface WelcomeCurtainProps {
  onOpen: () => void;
}

export function WelcomeCurtain({ onOpen }: WelcomeCurtainProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    // Check sessionStorage - only show once per session
    const hasSeenCurtain = sessionStorage.getItem("spmb_curtain_seen");
    if (hasSeenCurtain) {
      setIsVisible(false);
      onOpen();
    }
  }, [onOpen]);

  const handleOpen = () => {
    setIsOpening(true);
    sessionStorage.setItem("spmb_curtain_seen", "1");
    setTimeout(() => {
      setIsVisible(false);
      onOpen();
    }, 1000);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden">
          {/* Top Panel */}
          <motion.div
            className="absolute left-0 top-0 w-full h-[50.5%]"
            style={{
              background: "linear-gradient(180deg, #059669 0%, #10b981 100%)",
            }}
            animate={isOpening ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 1, ease: [0.85, 0, 0.15, 1] }}
          />

          {/* Bottom Panel */}
          <motion.div
            className="absolute left-0 bottom-0 w-full h-[50.5%]"
            style={{
              background: "linear-gradient(0deg, #059669 0%, #10b981 100%)",
            }}
            animate={isOpening ? { y: "100%" } : { y: 0 }}
            transition={{ duration: 1, ease: [0.85, 0, 0.15, 1] }}
          />

          {/* Animated grid background */}
          <div
            className="absolute inset-0 opacity-20 z-[1]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
              animation: "grid-move 20s linear infinite",
            }}
          />

          {/* Content */}
          <motion.div
            className="relative z-[2] text-center px-5 w-[95%] max-w-[550px]"
            animate={isOpening ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <img
                src="/logo.png"
                alt="Logo SDN 02 Cibadak"
                className="w-24 h-auto mx-auto md:w-32"
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white text-[7.5vw] md:text-[40px] font-black leading-tight tracking-tight drop-shadow-lg"
            >
              SPMB ONLINE 2026
            </motion.h1>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-white text-[4.5vw] md:text-[22px] font-bold mt-1 mb-5 tracking-wide"
            >
              SDN 02 CIBADAK
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-emerald-50 text-sm max-w-[300px] mx-auto mb-10 leading-relaxed"
            >
              Selamat Datang di Portal Penerimaan Siswa Baru
            </motion.p>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              onClick={handleOpen}
              className="group inline-flex items-center gap-3 bg-white text-emerald-600 px-10 py-4 rounded-full font-extrabold text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <span>Mulai Pendaftaran</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
