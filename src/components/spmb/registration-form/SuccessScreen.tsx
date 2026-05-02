import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { CheckCircle2, FileText, AlertTriangle, Phone, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SuccessScreen({ formData }: { formData: Record<string, string> }) {
  const dbId = formData.database_id ? formData.database_id.padStart(3, "0") : "000";
  const noReg = `CBD02-26-${dbId}`;

  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 8000); // Stop confetti after 8 seconds
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const text = `*KONFIRMASI PENDAFTARAN ONLINE*\n*SDN 02 CIBADAK - 2026*\n\nAssalamu'alaikum Warahmatullahi Wabarakatuh,\n\nYth. Panitia SPMB SDN 02 Cibadak,\n\nSaya ingin mengonfirmasi pendaftaran online ananda:\n- Nama: *${formData.nama}*\n- No. Reg: *#${noReg}*\n\nAlhamdulillah pendaftaran telah berhasil. Kami akan menunggu informasi selanjutnya. Terima kasih.`;
    window.open(`https://api.whatsapp.com/send?phone=6287777099842&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }} />}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-5"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </motion.div>

        <h2 className="text-2xl font-black text-emerald-700 mb-2">
          PENDAFTARAN BERHASIL
        </h2>
        <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto">
          Data ananda <b className="text-slate-800">{formData.nama}</b> resmi terdaftar di sistem SPMB SDN 02 Cibadak.
        </p>

        {/* Print Area - styled to match original closely */}
        <div className="bg-white border-2 border-emerald-500 p-6 rounded-2xl shadow-lg max-w-[400px] mx-auto text-left relative overflow-hidden" id="print-area">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] opacity-[0.03] pointer-events-none">
            <img src="/logo.png" alt="" className="w-full h-auto" />
          </div>
          
          <div className="relative z-10">
            <div className="text-center border-b border-dashed border-emerald-500 pb-4 mb-4">
              <CreditCard className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <b className="text-sm block uppercase tracking-wider text-slate-800">TANDA TERIMA PENDAFTARAN</b>
              <span className="text-xs text-slate-500">SDN 02 CIBADAK - TAHUN 2026</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                <span className="text-slate-500 text-xs">No. Registrasi</span>
                <b className="text-emerald-700 font-mono text-base tracking-widest">{noReg}</b>
              </div>
              
              <div className="flex flex-col gap-1 border-b border-slate-100 pb-2">
                <span className="text-slate-500 text-xs">Nama Lengkap</span>
                <strong className="text-slate-800 uppercase">{formData.nama}</strong>
              </div>

              <div className="flex flex-col gap-1 border-b border-slate-100 pb-2">
                <span className="text-slate-500 text-xs">NIK (Nomor Induk Kependudukan)</span>
                <strong className="text-slate-800 font-mono">{formData.nik}</strong>
              </div>
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500 text-xs">Tanggal Daftar</span>
                <strong className="text-slate-800 text-xs">
                  {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </strong>
              </div>
            </div>

            <div className="mt-5 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-700 block mb-1">PENTING:</span>
              <ul className="text-[10px] text-slate-600 space-y-1 list-disc pl-3">
                <li>Harap simpan/cetak bukti ini.</li>
                <li>Gunakan NIK untuk Cek Status.</li>
                <li>Wajib dibawa saat daftar ulang beserta foto copy Akta & KK.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-[400px] mx-auto mt-6 flex flex-col gap-3">
          <Button onClick={handlePrint} className="w-full py-6 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer shadow-lg shadow-emerald-500/30">
            <FileText className="w-4 h-4 mr-2" />
            SIMPAN / PRINT PDF
          </Button>
          
          <div className="bg-amber-50 border-2 border-dashed border-amber-400 p-4 rounded-xl mt-2 text-center">
            <b className="text-amber-700 text-sm flex items-center justify-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4" /> TAHAP SELANJUTNYA (WAJIB)
            </b>
            <div className="flex flex-col gap-3">
              <Button onClick={() => window.open('https://chat.whatsapp.com/L2H9qGBUrnnBiRHQm2EpRe', '_blank')} className="w-full bg-[#25d366] hover:bg-[#128c7e] text-white rounded-xl font-bold py-6 cursor-pointer shadow-md">
                <Phone className="w-4 h-4 mr-2" />
                WAJIB JOIN GRUP WA
              </Button>
              <Button variant="outline" onClick={handleWhatsApp} className="w-full py-6 rounded-xl font-bold text-slate-600 cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                KONFIRMASI KE PANITIA
              </Button>
            </div>
          </div>
          
          <Button variant="ghost" onClick={() => location.reload()} className="mt-4 text-slate-500 text-xs font-bold hover:bg-slate-100 cursor-pointer">
            <User className="w-3 h-3 mr-1" /> DAFTAR SISWA LAIN
          </Button>
        </div>
      </motion.div>
    </>
  );
}
