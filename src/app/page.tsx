"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WelcomeCurtain } from "@/components/spmb/WelcomeCurtain";
import { HeroHeader } from "@/components/spmb/HeroHeader";
import { StatusChecker } from "@/components/spmb/StatusChecker";
import { RegistrationForm } from "@/components/spmb/RegistrationForm";
import { FloatingActions } from "@/components/spmb/FloatingActions";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { AnimatedBackground } from "@/components/spmb/AnimatedBackground";

import { usePortalSettings } from "@/hooks/usePortalSettings";
import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import { StatusCurtain } from "@/components/spmb/StatusCurtain";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [curtainDismissed, setCurtainDismissed] = useState(false);
  const { settings, isLoading: isSettingsLoading } = usePortalSettings();
  const { stats } = useRealtimeStats();
  const [nowMillis, setNowMillis] = useState(Date.now());
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => setNowMillis(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check if curtain was already seen this session
    const seen = sessionStorage.getItem("spmb_curtain_seen");
    if (seen) {
      setCurtainDismissed(true);
      setShowContent(true);
    }
  }, []);

  // Wait for settings to load before dismissing loading screen
  useEffect(() => {
    if (!isSettingsLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSettingsLoading]);

  const handleCurtainOpen = () => {
    setCurtainDismissed(true);
    setTimeout(() => setShowContent(true), 300);
  };

  const getPortalStatus = () => {
    if (settings.maintenance) return "MAINTENANCE";
    if (settings.jadwalBuka && settings.jadwalTutup) {
      const bukaTime = new Date(settings.jadwalBuka).getTime();
      const tutupTime = new Date(settings.jadwalTutup).getTime();
      if (nowMillis < bukaTime) return "BEFORE_OPEN";
      if (nowMillis > tutupTime) return "CLOSED";
    }
    return "ACTIVE";
  };

  const portalStatus = getPortalStatus();

  if (isLoading || isSettingsLoading) {
    return <LoadingScreen />;
  }

  // If not active, show the dark sci-fi StatusCurtain which blocks everything
  if (portalStatus !== "ACTIVE") {
    return <StatusCurtain status={portalStatus} />;
  }

  return (
    <>
      <AnimatedBackground />

      {/* Welcome Curtain (Green splash screen) */}
      {!curtainDismissed && <WelcomeCurtain onOpen={handleCurtainOpen} />}

      {/* Main Content */}
      <AnimatePresence>
        {showContent && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[850px] mx-auto px-[15px] py-4 min-h-screen"
          >
            {/* Hero Header with Stats & Countdown */}
            <div className={isSearchActive ? "hidden" : "block"}>
              <HeroHeader />
            </div>

            {/* Status Checker */}
            <StatusChecker onSearchActive={setIsSearchActive} onEditData={(data) => { setEditData(data); setIsSearchActive(false); }} />

            {/* Registration Form */}
            <div className={isSearchActive ? "hidden" : "block"}>
              {editData ? (
                <RegistrationForm editData={editData} onEditDone={() => setEditData(null)} />
              ) : stats.sisa > 0 ? (
                <RegistrationForm />
              ) : (
                <div className="border-t-[5px] border-t-rose-500 shadow-2xl rounded-2xl p-8 md:p-12 text-center bg-white/80 backdrop-blur-xl border border-white/60 mt-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent pointer-events-none" />
                  <div className="w-[80px] h-[80px] bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-rose-100">
                    <svg className="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-[1.75rem] font-black text-slate-900 mb-3 tracking-[0.5px]">
                    PENDAFTARAN DITUTUP
                  </h3>
                  <p className="text-slate-500 text-[15px] max-w-md mx-auto leading-relaxed">
                    Mohon maaf, form pendaftaran telah ditutup otomatis karena <b>kuota penerimaan telah terisi penuh</b>. Terima kasih atas antusiasme Anda.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <footer className="text-center py-8 mt-6">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Sistem Online
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold">
                © 2026 SPMB <a href="https://www.sdn02cibadak.sch.id/" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 transition-colors">SDN 02 Cibadak</a>. All rights reserved.
              </p>
              <p className="text-[10px] text-slate-300 mt-1">
                Developed by <a href="https://www.ju99erknot.my.id/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors font-medium">@ju99erknot</a>
              </p>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      {showContent && <FloatingActions />}
    </>
  );
}
