"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<number>;
}

const stepLabels = [
  "Anak",
  "Alamat",
  "Fisik",
  "Berkas",
  "Ayah",
  "Ibu",
  "Wali",
  "Selesai",
];

export function StepProgress({
  currentStep,
  totalSteps,
  completedSteps,
}: StepProgressProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="relative flex justify-between items-center my-5 mb-10 px-1">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-slate-200 rounded-full z-[1]" />

      {/* Active Progress Line */}
      <motion.div
        className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full z-[2]"
        style={{
          background: "linear-gradient(90deg, #10b981, #059669)",
        }}
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Step Dots */}
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isDone = completedSteps.has(stepNum);
        const isPast = stepNum < currentStep;

        return (
          <motion.div
            key={stepNum}
            className="relative z-[3] flex flex-col items-center"
            animate={isActive ? { scale: 1.15 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={cn(
                "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-black text-[10px] md:text-xs border-2 md:border-[3px] transition-all duration-400",
                "shadow-[0_0_0_2px_white] md:shadow-[0_0_0_4px_white]",
                isActive &&
                  "border-emerald-500 text-emerald-500 bg-white shadow-[0_0_0_4px_rgba(16,185,129,0.2)] md:shadow-[0_0_0_5px_rgba(16,185,129,0.2)]",
                (isDone || isPast) &&
                  "border-emerald-500 bg-emerald-500 text-white",
                !isActive &&
                  !isDone &&
                  !isPast &&
                  "border-slate-200 bg-white text-slate-400"
              )}
            >
              {isDone || isPast ? (
                <Check className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={3} />
              ) : (
                stepNum
              )}
            </div>

            {/* Label below dot (desktop only) */}
            <span
              className={cn(
                "absolute -bottom-6 text-[8px] md:text-[9px] font-bold uppercase tracking-wider whitespace-nowrap hidden md:block",
                isActive && "text-emerald-600",
                (isDone || isPast) && "text-emerald-500",
                !isActive && !isDone && !isPast && "text-slate-400"
              )}
            >
              {stepLabels[i]}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
