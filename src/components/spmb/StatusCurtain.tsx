"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { usePortalSettings } from "@/hooks/usePortalSettings";

interface StatusCurtainProps {
  status: "MAINTENANCE" | "BEFORE_OPEN" | "CLOSED";
}

export function StatusCurtain({ status }: StatusCurtainProps) {
  const { settings } = usePortalSettings();
  
  const targetDate = settings.jadwalBuka ? new Date(settings.jadwalBuka) : null;
  const { timeLeft } = useCountdown(targetDate);
  
  const [mousePos, setMousePos] = useState({ x: "50%", y: "50%" });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: `${e.clientX}px`, y: `${e.clientY}px` });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const isMaintenance = status === "MAINTENANCE";
  
  const title = isMaintenance ? "SISTEM DIPERBAIKI" : "OFFICIAL SPMB 2026";
  const subtitle = isMaintenance ? "MAINTENANCE" : (status === "BEFORE_OPEN" ? "SEGERA DIBUKA" : "DITUTUP");
  const strokeColor = isMaintenance ? "#f59e0b" : "#0ea5e9";
  const description = isMaintenance 
    ? "Sistem Pendaftaran sedang dinonaktifkan sementara waktu oleh administrator untuk keperluan perbaikan. Silakan kembali lagi nanti."
    : (status === "BEFORE_OPEN" 
        ? "Penerimaan Siswa Baru SDN 02 Cibadak segera dibuka. Sistem akan otomatis terbuka setelah hitung mundur selesai. Harap bersabar."
        : "Pendaftaran Siswa Baru SDN 02 Cibadak Tahun Ajaran 2026 telah ditutup. Terima kasih atas partisipasi Anda.");

  return (
    <div className="fixed inset-0 z-[999999] bg-[#030308] text-[#f8fafc] font-sans overflow-hidden flex items-center justify-center">
      {/* Cool Spotlight */}
      <div 
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: `radial-gradient(circle 350px at ${mousePos.x} ${mousePos.y}, rgba(14, 165, 233, 0.12), transparent 80%)`
        }}
      />

      {/* Cool Grid BG */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(14, 165, 233, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(14, 165, 233, 0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          maskImage: "radial-gradient(circle at center, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 20%, transparent 80%)",
          animation: "grid-move 20s linear infinite"
        }}
      />

      <div className="relative z-[10] text-center w-full max-w-[900px] px-5 box-border">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2.5 bg-[#0ea5e9]/5 backdrop-blur-[10px] border border-[#0ea5e9]/30 px-[22px] py-2 rounded-full text-[11px] font-extrabold uppercase tracking-[2px] text-[#0ea5e9] mb-[25px]">
          <span className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-pulse-ring" style={{ boxShadow: "0 0 0 0 rgba(14,165,233,0.7)" }} /> 
          <span>{title}</span>
        </div>
        
        {/* HUGE PORTAL TEXT */}
        <h1 
          className="font-black tracking-[-3px] uppercase m-0 leading-[0.9]"
          style={{
            fontSize: "clamp(3.5rem, 12vw, 8rem)",
            background: "linear-gradient(180deg, #ffffff 30%, #64748b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          PORTAL
        </h1>
        
        {/* Subtitle with Stroke */}
        <div 
          className="font-extrabold text-transparent uppercase my-[15px] mb-[30px] tracking-[10px]"
          style={{
            fontSize: "clamp(1.2rem, 4vw, 2.8rem)",
            WebkitTextStroke: `1.5px ${strokeColor}`,
          }}
        >
          {subtitle}
        </div>
        
        {/* Timer Box (Only for BEFORE_OPEN and if not maintenance) */}
        {status === "BEFORE_OPEN" && !isMaintenance && (
          <div className="mx-auto mb-[30px] bg-[#0ea5e9]/5 p-5 rounded-[15px] border border-[#0ea5e9]/20 max-w-[400px] backdrop-blur-[5px]">
            <div 
              className="text-4xl md:text-[36px] font-black text-[#38bdf8] tracking-[3px]"
              style={{ fontFamily: '"Courier New", monospace' }}
            >
              {String(timeLeft.hari).padStart(2, "0")}:
              {String(timeLeft.jam).padStart(2, "0")}:
              {String(timeLeft.menit).padStart(2, "0")}:
              {String(timeLeft.detik).padStart(2, "0")}
            </div>
            <div className="text-[10px] text-[#94a3b8] font-extrabold tracking-[4px] mt-2">
              HARI JAM MENIT DETIK
            </div>
          </div>
        )}

        <p className="text-[#94a3b8] text-[16px] max-w-[550px] mx-auto mb-[40px] leading-[1.7]">
          {description}
        </p>
        
        <div className="flex justify-center gap-[15px] flex-wrap">
          <a 
            href="https://www.sdn02cibadak.sch.id/" 
            target="_blank"
            className="no-underline text-[#f8fafc] text-[12px] font-bold px-[28px] py-[14px] bg-white/5 border border-white/10 rounded-[14px] transition-all duration-400 hover:border-[#0ea5e9] hover:bg-[#0ea5e9]/10 hover:-translate-y-1.5"
          >
            🌐 WEB RESMI
          </a>
          <a 
            href="https://wa.me/6281563351528"
            className="no-underline text-[#f8fafc] text-[12px] font-bold px-[28px] py-[14px] bg-white/5 border border-white/10 rounded-[14px] transition-all duration-400 hover:border-[#0ea5e9] hover:bg-[#0ea5e9]/10 hover:-translate-y-1.5"
          >
            ✉️ HUBUNGI PANITIA
          </a>
        </div>
      </div>
      
      <footer className="absolute bottom-[30px] w-full px-[40px] box-border z-[10]">
        <div className="flex justify-between flex-wrap gap-[10px] border-t border-white/5 pt-[20px] text-[#64748b] text-[10px] tracking-[1.5px] font-bold">
          <div className="text-center">AUTHORIZED BY: OPS SDN 02 CIBADAK</div>
          <div className="text-center">SDN 02 CIBADAK - KAB. SUKABUMI</div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes grid-move { 0% { transform: translateY(0) translateX(0); } 100% { transform: translateY(50px) translateX(50px); } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(14, 165, 233, 0); } 100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); } }
      `}} />
    </div>
  );
}
