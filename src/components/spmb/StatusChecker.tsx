"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle2, Clock, XCircle, Loader2, Trophy, FileText, Smartphone, Undo, Home } from "lucide-react";

export function StatusChecker({ onSearchActive }: { onSearchActive?: (active: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleCheck = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setSearched(true);
    if (onSearchActive) onSearchActive(true);

    try {
      // Search by NIK or name
      const { data, error } = await supabase
        .from("pendaftar_dapodik")
        .select("id, nama, nik, jk, status_pendaftaran, created_at")
        .or(`nik.eq.${query},nama.ilike.%${query}%`)
        .limit(1);

      if (error) throw error;
      setResult(data && data.length > 0 ? data[0] : null);
    } catch (err) {
      console.error(err);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuery("");
    setResult(null);
    setSearched(false);
    if (onSearchActive) onSearchActive(false);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Diterima":
        return { color: "bg-emerald-500", icon: <CheckCircle2 className="w-4 h-4" />, text: "Diterima" };
      case "Tahap 2":
        return { color: "bg-purple-500", icon: <Clock className="w-4 h-4" />, text: "Tahap 2" };
      case "Ditolak":
        return { color: "bg-red-500", icon: <XCircle className="w-4 h-4" />, text: "Ditolak" };
      default:
        return { color: "bg-amber-500", icon: <Clock className="w-4 h-4" />, text: "Tahap 1" };
    }
  };

  return (
    <Card className="shadow-lg rounded-2xl mb-6 border-slate-100">
      <CardContent className="p-5 md:p-6">
        <h3 className="text-sm font-extrabold text-slate-800 mb-1 flex items-center gap-2">
          <Search className="w-4 h-4 text-emerald-500" />
          Cek Status Pendaftaran
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Masukkan NIK atau Nama untuk melihat status pendaftaran
        </p>

        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            placeholder="Masukkan NIK atau Nama..."
            className="flex-1 w-full px-[16px] py-[14px] rounded-[12px] border-2 border-slate-200 bg-slate-50 text-[14px] md:text-[15px] outline-none transition-all duration-300
              hover:bg-white hover:border-slate-300
              focus:border-emerald-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(16,185,129,0.15)]"
          />
          <button
            type="button"
            onClick={handleCheck}
            disabled={isLoading}
            className="px-[24px] py-[14px] rounded-[12px] bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold shadow-[0_8px_25px_rgba(16,185,129,0.25)] hover:-translate-y-0.5 transition-all cursor-pointer outline-none border-none flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "CEK"}
          </button>
        </div>

        {/* Result Tracker Box */}
        <AnimatePresence>
          {searched && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6"
            >
              {result ? (
                <ResultCard result={result} onReset={handleReset} />
              ) : (
                <div className="text-center p-6 bg-white rounded-[20px] border-2 border-dashed border-red-300 shadow-sm">
                  <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <h3 className="m-0 font-extrabold text-lg text-red-700">DATA TIDAK DITEMUKAN</h3>
                  <p className="text-xs text-red-900/70 mt-2 mb-4">Pastikan NIK atau nama yang dimasukkan sudah benar.</p>
                  <div className="flex gap-2">
                    <button onClick={handleReset} className="flex flex-1 justify-center items-center gap-2 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl font-bold transition-colors cursor-pointer">
                      <Undo className="w-4 h-4" /> Batal
                    </button>
                    <button onClick={() => window.location.reload()} className="flex flex-[2] justify-center items-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors shadow-sm cursor-pointer">
                      <Home className="w-4 h-4" /> Ke Beranda Pendaftaran
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function ResultCard({ result, onReset }: { result: any; onReset: () => void }) {
  const status = result.status_pendaftaran?.toLowerCase() || "";
  
  // Tahap 1 Defaults
  let warna = "#3b82f6"; // Blue
  let ikon = <FileText className="w-24 h-24 absolute -right-4 -top-4 opacity-20 rotate-12" />;
  let ikonUtama = <FileText className="w-16 h-16" />;
  let judul = "DATA TERDAFTAR";
  let sub = `Selamat! Berkas digital ananda <b>${result.nama}</b> sudah masuk antrean sistem.`;
  let step1 = "#3b82f6", step2 = "#e2e8f0", step3 = "#e2e8f0";
  let glow1 = "0 0 15px rgba(59, 130, 246, 0.5)", glow2 = "none", glow3 = "none";
  let isDiterima = false;

  if (status.includes("tahap 2")) {
    warna = "#f59e0b"; // Amber
    ikon = <Clock className="w-24 h-24 absolute -right-4 -top-4 opacity-20 -rotate-12" />;
    ikonUtama = <Clock className="w-16 h-16" />;
    judul = "VERIFIKASI DATA";
    sub = `Data ananda <b>${result.nama}</b> sedang dalam proses verifikasi oleh panitia.`;
    step2 = "#f59e0b";
    glow2 = "0 0 15px rgba(245, 158, 11, 0.5)";
  } else if (status.includes("tolak") || status.includes("penuh")) {
    warna = "#ef4444"; // Red
    ikon = <XCircle className="w-24 h-24 absolute -right-4 -top-4 opacity-20 rotate-12" />;
    ikonUtama = <XCircle className="w-16 h-16" />;
    judul = "DITOLAK";
    sub = `Mohon maaf, pendaftaran ananda <b>${result.nama}</b> tidak dapat dilanjutkan karena kuota penuh atau berkas tidak memenuhi syarat.`;
    step2 = "#f59e0b";
    step3 = "#ef4444";
    glow3 = "0 0 15px rgba(239, 68, 68, 0.5)";
  } else if (status.includes("diterima") || status.includes("lulus")) {
    warna = "#10b981"; // Emerald
    ikon = <Trophy className="w-24 h-24 absolute -right-4 -top-4 opacity-20 -rotate-12" />;
    ikonUtama = <Trophy className="w-16 h-16" />;
    judul = "HASIL: DITERIMA";
    isDiterima = true;
    step2 = "#f59e0b";
    step3 = "#10b981";
    glow3 = "0 0 15px rgba(16, 185, 129, 0.5)";
  }

  const noReg = `CBD02-26-${String(result.id || "000").padStart(3, '0')}`;
  const isFemale = result.jk?.toLowerCase() === "p";
  const linkVerif = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?v=${result.id}` : '';

  return (
    <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-slate-100">
      <div style={{ backgroundColor: warna }} className="p-[20px] text-white relative overflow-hidden">
        {ikon}
        <div className="text-[10px] font-bold tracking-[2px] opacity-80 mb-1">STATUS PENDAFTARAN</div>
        <div className="text-[18px] font-extrabold tracking-[0.5px]">{judul}</div>
      </div>
      
      <div className="p-[30px] text-center">
        {!isDiterima ? (
          <>
            <div className="flex justify-center mb-4 drop-shadow-md" style={{ color: warna }}>{ikonUtama}</div>
            <p className="text-[14px] text-slate-600 mx-auto mb-6 leading-relaxed max-w-[280px]" dangerouslySetInnerHTML={{ __html: sub }} />
          </>
        ) : (
          <div className="mb-6">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-[16px] mb-5">
              <Trophy className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-emerald-800 text-[13px] font-medium m-0 leading-relaxed">
                Selamat! Ananda <b className="font-extrabold uppercase">{result.nama}</b> resmi menjadi bagian dari <b>SDN 02 Cibadak</b>.
              </p>
            </div>

            {/* BUKTI KELULUSAN CARD - Exactly matching legacy */}
            <div id="print-area" className="bg-white border-2 border-emerald-500 p-5 relative text-left" style={{ borderRadius: '16px' }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] opacity-[0.04] pointer-events-none">
                <img src="/logo.png" alt="" className="w-full h-auto" />
              </div>
              
              <div className="relative z-10">
                <div className="text-center border-b-[3px] border-double border-slate-300 pb-3 mb-4">
                  <h2 className="m-0 text-[16px] font-black text-slate-800">PANITIA SPMB ONLINE 2026</h2>
                  <p className="m-0 text-[11px] font-medium text-slate-500">SDN 02 CIBADAK - Kab. Sukabumi</p>
                </div>

                <h3 className="text-center text-[14px] font-bold underline mb-4 text-emerald-700 decoration-emerald-500/30 decoration-2 underline-offset-4">BUKTI KELULUSAN SELEKSI</h3>

                <div className="text-center mb-4">
                  <div className="mb-3">
                    <span className="text-[10px] text-slate-400 font-bold tracking-widest block mb-1">NAMA LENGKAP:</span>
                    <b className="text-[16px] uppercase block text-slate-800 leading-none">{result.nama}</b>
                  </div>
                  <div className="mb-4">
                    <span className="text-[10px] text-slate-400 font-bold tracking-widest block mb-1">NOMOR REGISTRASI:</span>
                    <b className="text-[20px] block text-emerald-500 leading-none tracking-tight">#{noReg}</b>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-4">
                    <span className="text-[11px] text-red-600 font-bold flex justify-center items-center gap-1.5 mb-1.5">
                      <Clock className="w-3.5 h-3.5" /> JADWAL DAFTAR ULANG:
                    </span>
                    <b className="text-[13px] text-slate-800 block">Senin - Rabu, 16 - 18 Maret 2026</b>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Pukul 08.00 - 12.00 WIB (Di Ruang Panitia)</span>
                  </div>

                  <div className="text-left border border-slate-200 p-0 text-[11px] leading-relaxed bg-white rounded-xl overflow-hidden shadow-sm mb-5">
                    <b className={`block border-b border-slate-200 p-2 text-center text-[11px] font-bold tracking-wide ${isFemale ? 'bg-pink-50 text-pink-700' : 'bg-blue-50 text-blue-700'}`}>
                      CHECKLIST BERKAS (MAP {isFemale ? 'MERAH (Perempuan)' : 'BIRU (Laki-laki)'}):
                    </b>
                    <div className="p-3 pb-2 text-slate-600 space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-3 h-3 border border-slate-400 mt-0.5 shrink-0"></div>
                        <span>Membawa <b>Materai 10.000</b> (2 Lembar)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-3 h-3 border border-slate-400 mt-0.5 shrink-0"></div>
                        <span>FC KK & Akta Kelahiran (2 Lembar) <b>+ Tunjukkan ASLI</b></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-3 h-3 border border-slate-400 mt-0.5 shrink-0"></div>
                        <span>Fotocopy KTP Orang Tua (Ayah & Ibu)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-3 h-3 border border-slate-400 mt-0.5 shrink-0"></div>
                        <span>Formulir S1: <span className="italic">Akan dicetakan oleh Panitia saat daftar ulang.</span></span>
                      </div>
                    </div>
                    <div className="px-3 pb-3 text-[9px] text-slate-400 italic">
                      *Panitia akan menceklis kotak di atas saat verifikasi berkas asli.
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-dashed border-slate-200">
                    <div className="p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=75x75&data=${encodeURIComponent(linkVerif)}`} className="w-[70px] h-[70px] rounded block" alt="QR Code" />
                    </div>
                    <div className="text-center w-[150px]">
                      <p className="text-[10px] text-slate-500 mb-8">Ketua Panitia SPMB,</p>
                      <p className="font-bold text-[11px] underline text-slate-800 decoration-slate-300 underline-offset-4">( SDN 02 CIBADAK )</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-50 rounded-[20px] p-5 mb-5 border border-slate-200">
          <div className="flex justify-around items-center gap-2">
            {/* Step 1 */}
            <div className="text-center relative flex-1">
              <div style={{ backgroundColor: step1, boxShadow: glow1 }} className="w-11 h-11 rounded-full mx-auto mb-2.5 border-[3px] border-white flex items-center justify-center text-white font-extrabold text-sm transition-all duration-500">1</div>
              <div style={{ color: step1 }} className="font-bold text-[12px] tracking-wide whitespace-nowrap">INPUT</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Pendaftaran</div>
            </div>
            
            {/* Step 2 */}
            <div className="text-center relative flex-1">
              <div style={{ backgroundColor: step2, boxShadow: glow2 }} className="w-11 h-11 rounded-full mx-auto mb-2.5 border-[3px] border-white flex items-center justify-center text-white font-extrabold text-sm transition-all duration-500">2</div>
              <div style={{ color: step2 }} className="font-bold text-[12px] tracking-wide whitespace-nowrap">VERIFIKASI</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Validasi Data</div>
            </div>
            
            {/* Step 3 */}
            <div className="text-center relative flex-1">
              <div style={{ backgroundColor: step3, boxShadow: glow3 }} className="w-11 h-11 rounded-full mx-auto mb-2.5 border-[3px] border-white flex items-center justify-center text-white font-extrabold text-sm transition-all duration-500">3</div>
              <div style={{ color: step3 }} className="font-bold text-[12px] tracking-wide whitespace-nowrap">HASIL</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Keputusan</div>
            </div>
          </div>
        </div>

        {isDiterima && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button onClick={() => window.print()} className="w-full h-auto bg-slate-800 hover:bg-slate-900 text-white rounded-[16px] font-bold py-4 cursor-pointer shadow-[0_8px_20px_rgba(15,23,42,0.2)] hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-1">
              <span className="flex items-center gap-2 text-[13px]"><FileText className="w-4 h-4" /> SIMPAN PDF</span>
              <span className="text-[9px] font-medium opacity-80 font-normal">Cetak Bukti Lulus</span>
            </Button>
            <Button onClick={() => window.open('https://chat.whatsapp.com/L2H9qGBUrnnBiRHQm2EpRe', '_blank')} className="w-full h-auto bg-[#25d366] hover:bg-[#128c7e] text-white rounded-[16px] font-bold py-4 cursor-pointer shadow-[0_8px_20px_rgba(37,211,102,0.25)] hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-1">
              <span className="flex items-center gap-2 text-[13px]"><Smartphone className="w-4 h-4" /> GRUP WA</span>
              <span className="text-[9px] font-medium opacity-80 font-normal">Join grup pendaftar</span>
            </Button>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="bg-slate-50 border-t border-dashed border-slate-200 p-4 flex gap-3">
        <button onClick={onReset} className="flex flex-1 justify-center items-center gap-2 py-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-500 rounded-xl font-bold text-[13px] transition-colors shadow-sm cursor-pointer">
          <Undo className="w-4 h-4" /> Batal
        </button>
        <button onClick={() => window.location.reload()} className="flex flex-[2] justify-center items-center gap-2 py-3 text-white rounded-xl font-bold text-[13px] transition-colors shadow-sm cursor-pointer" style={{ backgroundColor: warna }}>
          <Home className="w-4 h-4" /> Ke Beranda Pendaftaran
        </button>
      </div>
    </div>
  );
}
