"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { X, BarChart3, Users, Activity } from "lucide-react";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnalyticsData {
  total: number;
  laki: number;
  perempuan: number;
  kecamatanData: Record<string, number>;
}

const MAX_KUOTA = 72;
const BAR_COLORS = [
  "#4f46e5",
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    loadData();
  }, [isOpen]);

  const loadData = async () => {
    try {
      const { data: rows } = await supabase
        .from("pendaftar_dapodik")
        .select("jk, kecamatan, created_at");

      if (!rows) return;

      const total = rows.length;
      const laki = rows.filter((x) => (x.jk || "").toUpperCase() === "L").length;
      const perempuan = total - laki;

      const kecamatanData: Record<string, number> = {};
      rows.forEach((d) => {
        const kec = (d.kecamatan || "TIDAK DIKETAHUI").toUpperCase();
        kecamatanData[kec] = (kecamatanData[kec] || 0) + 1;
      });

      setData({ total, laki, perempuan, kecamatanData });
    } catch (err) {
      console.error("Analytics error:", err);
    }
  };

  if (!isOpen) return null;

  const sortedKec = data
    ? Object.entries(data.kecamatanData).sort(([, a], [, b]) => b - a)
    : [];
  const maxKec = sortedKec.length > 0 ? sortedKec[0][1] : 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100000] flex items-end md:items-center justify-center"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white w-full md:w-[90%] md:max-w-[420px] rounded-t-3xl md:rounded-3xl p-6 md:p-7 max-h-[90vh] overflow-y-auto relative"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                Dashboard Analitik
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Data Real-time SPMB 2026
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {data ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-3 rounded-2xl text-center text-white">
                  <div className="text-[8px] font-bold opacity-80 uppercase">
                    Total
                  </div>
                  <div className="text-2xl font-black">{data.total}</div>
                </div>
                <div className="bg-sky-50 border border-sky-100 p-3 rounded-2xl text-center">
                  <div className="text-[8px] font-bold text-sky-400 uppercase">
                    Laki-laki
                  </div>
                  <div className="text-2xl font-black text-sky-800">
                    {data.laki}
                  </div>
                </div>
                <div className="bg-pink-50 border border-pink-100 p-3 rounded-2xl text-center">
                  <div className="text-[8px] font-bold text-pink-400 uppercase">
                    Perempuan
                  </div>
                  <div className="text-2xl font-black text-pink-800">
                    {data.perempuan}
                  </div>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="mb-5">
                <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[1.5px] mb-3">
                  📈 Distribusi Jenis Kelamin
                </h4>
                <div className="flex items-center justify-center gap-6">
                  <div
                    className="w-32 h-32 rounded-full relative"
                    style={{
                      background:
                        data.total > 0
                          ? `conic-gradient(#3b82f6 0% ${Math.round((data.laki / data.total) * 100)}%, #ec4899 ${Math.round((data.laki / data.total) * 100)}% 100%)`
                          : "#e2e8f0",
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                        <span className="text-xl font-black text-slate-900">
                          {data.total}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">
                          Pendaftar
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      Laki-laki
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                      Perempuan
                    </div>
                  </div>
                </div>
              </div>

              {/* Bar Chart: Kecamatan */}
              <div className="mb-5">
                <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[1.5px] mb-3">
                  🏘️ Sebaran Wilayah Kecamatan
                </h4>
                {sortedKec.length === 0 ? (
                  <p className="text-center text-slate-400 text-xs py-4">
                    Belum ada data
                  </p>
                ) : (
                  <div className="space-y-2">
                    {sortedKec.slice(0, 8).map(([kec, count], i) => (
                      <div key={kec} className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold text-slate-500 min-w-[70px] text-right truncate">
                          {kec.length > 10 ? kec.slice(0, 10) + ".." : kec}
                        </span>
                        <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.round((count / maxKec) * 100)}%`,
                            }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="h-full rounded-full"
                            style={{
                              background: BAR_COLORS[i % BAR_COLORS.length],
                            }}
                          />
                        </div>
                        <span className="text-[10px] font-extrabold text-slate-800 min-w-[20px]">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Kuota Meter */}
              <div className="mb-4">
                <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[1.5px] mb-3">
                  🎯 Kapasitas Kuota
                </h4>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-slate-600">
                      Terisi
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-500">
                      {data.total} / {MAX_KUOTA}
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min((data.total / MAX_KUOTA) * 100, 100)}%`,
                      }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase">
                    Live data from Supabase
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
