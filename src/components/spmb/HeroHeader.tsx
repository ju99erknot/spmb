"use client";

import { motion } from "framer-motion";
import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import { useCountdown } from "@/hooks/useCountdown";
import { Users, UserCheck, Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

import { usePortalSettings } from "@/hooks/usePortalSettings";

export function HeroHeader() {
  const { stats } = useRealtimeStats();
  const { settings } = usePortalSettings();
  const [serverTime, setServerTime] = useState("");
  const [nowMillis, setNowMillis] = useState(Date.now());

  // Determine countdown target and label based on state
  const isMaintenance = settings.maintenance;
  let targetDate = new Date();
  let countdownLabel = "Batas Waktu Pendaftaran";

  if (settings.jadwalBuka && settings.jadwalTutup) {
    const bukaTime = new Date(settings.jadwalBuka).getTime();
    const tutupTime = new Date(settings.jadwalTutup).getTime();

    if (nowMillis < bukaTime) {
      targetDate = new Date(settings.jadwalBuka);
      countdownLabel = "Portal Segera Dibuka";
    } else if (nowMillis > tutupTime) {
      targetDate = new Date(settings.jadwalTutup); // Expired
      countdownLabel = "Pendaftaran Ditutup";
    } else {
      targetDate = new Date(settings.jadwalTutup);
      countdownLabel = "Batas Waktu Pendaftaran";
    }
  }

  const { timeLeft } = useCountdown(targetDate);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setServerTime(
        now.toLocaleString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setNowMillis(now.getTime());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-[30px] font-sans">
      {/* Hero Banner */}
      <div className="relative rounded-[20px] md:rounded-[24px] mx-[10px] md:mx-0 overflow-hidden shadow-[0_15px_35px_rgba(16,185,129,0.25)]">
        <div
          className="pt-[25px] md:pt-[35px] px-[20px] md:px-[30px] pb-[45px] text-white relative z-[2]"
          style={{
            background: "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
          }}
        >
          {/* Floating circles decoration */}
          <div className="absolute right-[-20px] top-[-50px] w-[250px] h-[250px] bg-white/10 rounded-full animate-float pointer-events-none" />
          <div className="absolute right-[150px] bottom-[-60px] w-[120px] h-[120px] bg-white/15 rounded-full animate-float pointer-events-none" style={{ animationDelay: "-3s" }} />

          {/* Watermark Logo */}
          <img
            src="/logo.png"
            alt=""
            className="absolute right-[-20px] md:right-[-30px] bottom-[-30px] md:bottom-[-40px] w-[160px] md:w-[220px] h-[160px] md:h-[220px] opacity-15 object-contain pointer-events-none rotate-[-15deg] z-[1] animate-float"
            style={{ animationDuration: "10s" }}
          />

          <div className="relative z-[2]">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[28px] md:text-[38px] font-black leading-tight tracking-tight m-0"
              style={{
                textShadow: "1px 1px 0 #0284c7, 2px 2px 0 #0284c7, 3px 3px 0 #0284c7, 4px 4px 0 #0284c7, 5px 5px 15px rgba(0,0,0,0.4)",
                transform: "skew(-5deg)",
              }}
            >
              SPMB ONLINE 2026
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[12px] md:text-[15px] font-extrabold opacity-95 mt-1 tracking-[2px] uppercase"
              style={{
                color: "#fef08a",
                textShadow: "1px 1px 0 rgba(0,0,0,0.2)",
                transform: "skew(-5deg)",
              }}
            >
              SDN 02 CIBADAK
            </motion.p>

            {/* System Time Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-black/15 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-full mt-4 md:mt-5 border border-white/10"
            >
              <div className="w-2 h-2 bg-[#f59e0b] rounded-full animate-pulse-ring" style={{ boxShadow: "0 0 0 0 rgba(245, 158, 11, 0.7)" }} />
              <span className="text-xs font-bold font-mono tracking-wider">
                {serverTime}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {/* Stats Cards */}
      <div className="flex flex-row gap-[10px] md:gap-[15px] -mt-[20px] md:-mt-[30px] px-[10px] md:px-[20px] relative z-[5]">
        <StatsCard
          icon={<Users className="w-3.5 h-3.5" />}
          label="Pendaftar"
          value={stats.total}
          delay={0.2}
        >
          <div className="mt-[15px] h-[6px] bg-[#f1f5f9] rounded-[6px] overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ width: `${Math.min(100, Math.round((stats.total / 72) * 100))}%` }}
            />
          </div>
        </StatsCard>
        <StatsCard
          icon={<UserCheck className="w-3.5 h-3.5" />}
          label="Sisa Kuota"
          value={stats.sisa}
          delay={0.3}
        >
          <div className="text-[11px] font-bold text-[#94a3b8] mt-[10px] uppercase">
            {stats.sisa > 0 ? "Kuota Tersedia" : "Kuota Habis"}
          </div>
        </StatsCard>
      </div>

      {/* Countdown Timer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[20px] p-[15px_10px] md:p-[25px] mx-[10px] md:mx-[20px] mt-[10px] md:mt-[15px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] text-center relative overflow-hidden z-[1]"
      >
        {/* Background watermark icon */}
        <div className="absolute right-[-20px] bottom-[-30px] text-[160px] text-emerald-500/5 pointer-events-none rotate-[15deg]">
          <Clock />
        </div>

        <div className="relative z-[1]">
          <div className="flex items-center justify-center gap-2 mb-[15px]">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[12px] font-extrabold text-[#64748b] uppercase tracking-[1.5px]">
              {isMaintenance ? "SYSTEM MAINTENANCE" : countdownLabel}
            </span>
          </div>

          <div className="flex justify-center gap-[8px] md:gap-[15px]">
            {[
              { value: timeLeft.hari, label: "HARI" },
              { value: timeLeft.jam, label: "JAM" },
              { value: timeLeft.menit, label: "MENIT" },
              { value: timeLeft.detik, label: "DETIK" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex-1 min-w-0 md:min-w-[50px] bg-gradient-to-b from-white to-slate-50 rounded-[12px] md:rounded-[14px] p-[12px_2px] md:p-[15px_10px] border border-slate-200 text-center hover:-translate-y-1 hover:shadow-md hover:border-emerald-200 transition-all duration-300"
              >
                <motion.span
                  key={item.value}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="block text-[18px] md:text-[24px] font-black text-emerald-500"
                  style={{ textShadow: "0 2px 4px rgba(16,185,129,0.2)" }}
                >
                  {String(item.value).padStart(2, "0")}
                </motion.span>
                <small className="block text-[8px] md:text-[10px] font-bold text-slate-400 mt-1 tracking-wider uppercase">
                  {item.label}
                </small>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatsCard({
  icon,
  label,
  value,
  delay,
  children
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  delay: number;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex-1 bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-[15px_10px] md:p-[24px] text-center shadow-[0_10px_25px_rgba(0,0,0,0.08)] relative overflow-hidden group hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(16,185,129,0.15)] hover:border-white/80 transition-all duration-400 z-[4]"
    >
      {/* Background Watermark Icon */}
      <div className="absolute right-[-15px] bottom-[-20px] text-[80px] text-emerald-500/[0.06] pointer-events-none rotate-[-15deg] group-hover:rotate-[-5deg] group-hover:scale-110 group-hover:text-emerald-500/[0.12] transition-all duration-400 z-[0]">
        {icon}
      </div>

      <div className="relative z-[1]">
        <div className="flex items-center justify-center gap-[6px] mb-[10px]">
          <span className="text-emerald-500 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300">
            {icon}
          </span>
          <span className="text-[9px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.5px] md:tracking-[1px]">
            {label}
          </span>
        </div>
        <motion.div
          key={String(value)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[26px] md:text-[42px] font-black text-slate-900 leading-none"
        >
          {value}
        </motion.div>
        {children}
      </div>
    </motion.div>
  );
}
