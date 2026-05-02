"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, BarChart3, X, Send, Plus } from "lucide-react";
import { AnalyticsModal } from "./AnalyticsModal";

export function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWA, setShowWA] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [waMessage, setWaMessage] = useState(
    "Halo Panitia SPMB SDN 02 Cibadak, saya ingin bertanya mengenai..."
  );

  const toggleFab = () => {
    setIsOpen(!isOpen);
    setShowWA(false);
  };

  const openWA = () => {
    setShowWA(true);
    setIsOpen(false);
  };

  const sendWA = () => {
    if (!waMessage.trim()) return;
    const url = `https://wa.me/6287777099842?text=${encodeURIComponent(waMessage)}`;
    window.open(url, "_blank");
    setShowWA(false);
  };

  return (
    <>
      <div className="fixed right-5 bottom-5 md:right-8 md:bottom-8 z-[99999]">
        {/* WhatsApp Modal */}
        <AnimatePresence>
          {showWA && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-20 right-0 w-72 bg-white rounded-2xl p-4 shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  Hubungi Panitia
                </h4>
                <button
                  onClick={() => setShowWA(false)}
                  className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <textarea
                value={waMessage}
                onChange={(e) => setWaMessage(e.target.value)}
                className="w-full h-24 p-3 rounded-xl border border-slate-200 text-[13px] bg-slate-50 resize-none outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
              <button
                onClick={sendWA}
                className="w-full mt-2 bg-green-500 text-white py-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-green-600 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim via WhatsApp
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB Items */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.button
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1, x: -65, y: -12 }}
                exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                onClick={openWA}
                className="absolute bottom-1 right-1 w-[46px] h-[46px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(37,211,102,0.3)] hover:scale-110 transition-all cursor-pointer border-2 border-white"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1, x: -12, y: -65 }}
                exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.4, delay: 0.05 }}
                onClick={() => { setShowAnalytics(true); setIsOpen(false); }}
                className="absolute bottom-1 right-1 w-[46px] h-[46px] rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center shadow-[0_8px_20px_rgba(15,23,42,0.3)] hover:scale-110 hover:text-emerald-300 hover:bg-slate-700 transition-all cursor-pointer border-2 border-white"
              >
                <BarChart3 className="w-5 h-5" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          onClick={toggleFab}
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.3, type: "spring", bounce: 0.5 }}
          className="relative w-[54px] h-[54px] md:w-[58px] md:h-[58px] bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white rounded-full flex items-center justify-center text-2xl shadow-[0_10px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all z-10 cursor-pointer border-2 border-white/20"
        >
          {/* Pulse ring */}
          <div className="absolute w-full h-full rounded-full bg-emerald-400 opacity-40 animate-ping -z-10" style={{ animationDuration: '3s' }} />
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />
    </>
  );
}
