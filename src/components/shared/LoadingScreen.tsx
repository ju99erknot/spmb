"use client";

import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#030308] flex items-center justify-center z-[9999999]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <motion.p
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white tracking-[3px] text-[11px] font-bold uppercase"
        >
          Menghubungkan ke sistem...
        </motion.p>
      </motion.div>
    </div>
  );
}
