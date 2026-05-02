"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-slate-50">
      {/* Dynamic Mesh Gradients */}
      <motion.div
        animate={{
          x: [0, 100, 0, -100, 0],
          y: [0, 50, 100, 50, 0],
          scale: [1, 1.2, 1, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-300/30 rounded-full blur-[100px] mix-blend-multiply"
      />
      <motion.div
        animate={{
          x: [0, -100, 0, 100, 0],
          y: [0, -50, -100, -50, 0],
          scale: [1, 0.8, 1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-40 -right-20 w-[600px] h-[600px] bg-teal-200/40 rounded-full blur-[120px] mix-blend-multiply"
      />
      <motion.div
        animate={{
          x: [0, 50, 100, -50, 0],
          y: [0, 100, 0, -100, 0],
          scale: [1, 1.5, 1, 0.8, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-40 left-20 w-[400px] h-[400px] bg-cyan-200/30 rounded-full blur-[90px] mix-blend-multiply"
      />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" 
        style={{ backgroundSize: '40px 40px' }}
      />
      
      {/* Light Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
    </div>
  );
}
