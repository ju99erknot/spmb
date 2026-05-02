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
import { StatusCurtain } from "@/components/spmb/StatusCurtain";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [curtainDismissed, setCurtainDismissed] = useState(false);
  const { settings, isLoading: isSettingsLoading } = usePortalSettings();
  const [nowMillis, setNowMillis] = useState(Date.now());
  const [isSearchActive, setIsSearchActive] = useState(false);

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
            <StatusChecker onSearchActive={setIsSearchActive} />

            {/* Registration Form */}
            <div className={isSearchActive ? "hidden" : "block"}>
              <RegistrationForm />
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
                Developed by <a href="https://ops.sdn02cibadak.sch.id/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors font-medium">OPS SDN 02 Cibadak</a>
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
