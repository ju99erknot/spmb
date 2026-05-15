"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronDown,
  ArrowLeft,
  HelpCircle,
  FileText,
  CalendarDays,
  ClipboardCheck,
  Users,
  MapPin,
  Phone,
  ShieldCheck,
  GraduationCap,
  Clock,
} from "lucide-react";
import { AnimatedBackground } from "@/components/spmb/AnimatedBackground";

interface FAQItem {
  q: string;
  a: string;
  icon: React.ReactNode;
}

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: "Pendaftaran",
    icon: <FileText className="w-5 h-5" />,
    color: "#10b981",
    items: [
      {
        q: "Bagaimana cara mendaftar di SDN 02 Cibadak?",
        a: "Pendaftaran dilakukan secara online melalui portal SPMB di spmb.sdn02cibadak.sch.id. Isi formulir pendaftaran dengan data yang benar sesuai dokumen resmi (Kartu Keluarga, Akta Kelahiran, dll). Setelah submit, Anda akan mendapatkan nomor verifikasi untuk mengecek status.",
        icon: <ClipboardCheck className="w-4 h-4" />,
      },
      {
        q: "Apakah pendaftaran online ini gratis?",
        a: "Ya, pendaftaran online di portal SPMB sepenuhnya gratis. Tidak ada biaya apapun yang dikenakan untuk proses pendaftaran.",
        icon: <ShieldCheck className="w-4 h-4" />,
      },
      {
        q: "Berapa kuota penerimaan siswa baru?",
        a: "Kuota penerimaan peserta didik baru SDN 02 Cibadak untuk tahun ajaran 2026/2027 adalah sebanyak 72 siswa (2 rombel × 36 siswa). Kuota dapat berubah sesuai kebijakan dinas pendidikan.",
        icon: <Users className="w-4 h-4" />,
      },
      {
        q: "Apa saja persyaratan usia untuk mendaftar?",
        a: "Calon peserta didik baru harus berusia minimal 6 tahun pada tanggal 1 Juli 2026. Usia 5 tahun 6 bulan diperbolehkan dengan rekomendasi tertulis dari psikolog profesional.",
        icon: <CalendarDays className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Berkas & Dokumen",
    icon: <ClipboardCheck className="w-5 h-5" />,
    color: "#3b82f6",
    items: [
      {
        q: "Apa saja berkas yang harus disiapkan?",
        a: "Berkas yang diperlukan:\n• Kartu Keluarga (KK) — asli & fotokopi\n• Akta Kelahiran — asli & fotokopi\n• KTP orang tua/wali — fotokopi\n• Pas foto 3×4 berwarna (4 lembar)\n• Surat Keterangan sehat dari dokter\n• Ijazah/Surat Keterangan Lulus TK/PAUD (jika ada)",
        icon: <FileText className="w-4 h-4" />,
      },
      {
        q: "Apakah lulusan TK/PAUD wajib?",
        a: "Tidak wajib. Anak yang tidak mengikuti pendidikan TK/PAUD tetap dapat mendaftar ke SDN 02 Cibadak, selama memenuhi persyaratan usia.",
        icon: <GraduationCap className="w-4 h-4" />,
      },
      {
        q: "Bagaimana jika ada berkas yang belum lengkap?",
        a: "Anda tetap dapat melakukan pendaftaran online terlebih dahulu. Berkas fisik yang belum lengkap dapat dilengkapi saat proses verifikasi/daftar ulang sesuai jadwal yang ditentukan.",
        icon: <Clock className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Seleksi & Zonasi",
    icon: <MapPin className="w-5 h-5" />,
    color: "#eab308",
    items: [
      {
        q: "Bagaimana sistem seleksi penerimaan?",
        a: "Seleksi menggunakan sistem zonasi sesuai Permendikbud. Prioritas diberikan berdasarkan:\n1. Jarak tempat tinggal ke sekolah (zonasi)\n2. Usia calon peserta didik\n3. Urutan waktu pendaftaran\n\nTidak ada tes akademis untuk penerimaan siswa baru tingkat SD.",
        icon: <ClipboardCheck className="w-4 h-4" />,
      },
      {
        q: "Apa yang dimaksud dengan sistem zonasi?",
        a: "Sistem zonasi adalah mekanisme penerimaan siswa berdasarkan kedekatan jarak tempat tinggal dengan sekolah. Calon siswa yang berdomisili lebih dekat dengan SDN 02 Cibadak mendapat prioritas lebih tinggi. Alamat diverifikasi melalui Kartu Keluarga.",
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        q: "Apakah anak dari luar kecamatan bisa mendaftar?",
        a: "Bisa. Semua anak dapat mendaftar. Namun, prioritas penerimaan tetap mengikuti sistem zonasi. Anak dari luar zona akan diterima jika masih tersedia kuota setelah zona prioritas terpenuhi.",
        icon: <Users className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Jadwal & Pengumuman",
    icon: <CalendarDays className="w-5 h-5" />,
    color: "#8b5cf6",
    items: [
      {
        q: "Kapan pengumuman hasil seleksi?",
        a: "Pengumuman hasil seleksi akan diinformasikan melalui portal SPMB online dan notifikasi email (jika email terdaftar). Pantau terus portal SPMB untuk informasi terbaru mengenai jadwal pengumuman.",
        icon: <CalendarDays className="w-4 h-4" />,
      },
      {
        q: "Bagaimana cara mengecek status pendaftaran?",
        a: "Gunakan fitur 'Cek Status Pendaftaran' di halaman utama portal SPMB. Masukkan NIK siswa atau kode verifikasi yang diberikan saat pendaftaran. Status akan menampilkan tahapan terkini (Tahap 1, Tahap 2, Diterima, atau Ditolak).",
        icon: <HelpCircle className="w-4 h-4" />,
      },
      {
        q: "Apa yang harus dilakukan setelah dinyatakan diterima?",
        a: "Setelah dinyatakan diterima, orang tua/wali wajib melakukan daftar ulang sesuai jadwal yang ditentukan dengan membawa:\n• Berkas asli untuk diverifikasi\n• Bukti pendaftaran online\n• Pas foto tambahan jika diperlukan\n\nJika tidak melakukan daftar ulang sesuai jadwal, maka kursi dianggap mengundurkan diri.",
        icon: <ShieldCheck className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Kontak & Bantuan",
    icon: <Phone className="w-5 h-5" />,
    color: "#f43f5e",
    items: [
      {
        q: "Bagaimana jika mengalami kendala saat mendaftar?",
        a: "Jika mengalami kendala teknis saat mengisi formulir online, Anda dapat:\n• Datang langsung ke SDN 02 Cibadak untuk dibantu oleh panitia\n• Menghubungi nomor telepon sekolah di jam kerja\n• Pastikan koneksi internet stabil dan gunakan browser terbaru",
        icon: <HelpCircle className="w-4 h-4" />,
      },
      {
        q: "Di mana alamat SDN 02 Cibadak?",
        a: "SDN 02 Cibadak berlokasi di Jl. Kebon Pala 2 Cibadak, Kabupaten Sukabumi, Jawa Barat. Sekolah dapat dikunjungi pada hari kerja (Senin–Jumat) pukul 07.00–14.00 WIB.",
        icon: <MapPin className="w-4 h-4" />,
      },
    ],
  },
];

function FAQAccordionItem({ item, index }: { item: FAQItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left group"
        aria-expanded={isOpen}
      >
        <div
          className={`flex items-start gap-3 p-4 rounded-xl transition-all duration-300 ${
            isOpen
              ? "bg-emerald-50/80 border border-emerald-200/60"
              : "bg-white/60 border border-slate-100 hover:bg-emerald-50/40 hover:border-emerald-200/40"
          }`}
        >
          <div
            className={`mt-0.5 p-1.5 rounded-lg transition-colors duration-300 ${
              isOpen
                ? "bg-emerald-500 text-white"
                : "bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600"
            }`}
          >
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`font-semibold text-[14px] leading-snug transition-colors duration-300 ${
                isOpen ? "text-emerald-800" : "text-slate-700"
              }`}
            >
              {item.q}
            </p>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 text-[13px] text-slate-600 leading-relaxed whitespace-pre-line border-t border-emerald-100/60 pt-3">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="mt-1 flex-shrink-0"
          >
            <ChevronDown
              className={`w-4 h-4 transition-colors duration-300 ${
                isOpen ? "text-emerald-500" : "text-slate-300"
              }`}
            />
          </motion.div>
        </div>
      </button>
    </motion.div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <>
      <AnimatedBackground />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[850px] mx-auto px-[15px] py-6 min-h-screen"
      >
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-600 transition-colors mb-6 font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/20 mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Pertanyaan Umum
          </h1>
          <p className="text-slate-500 text-[15px] max-w-md mx-auto leading-relaxed">
            Temukan jawaban untuk pertanyaan yang sering diajukan seputar SPMB
            SDN 02 Cibadak
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide"
        >
          {faqData.map((cat, i) => (
            <button
              key={cat.title}
              onClick={() => setActiveCategory(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all duration-300 border ${
                activeCategory === i
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25"
                  : "bg-white/80 text-slate-500 border-slate-200/60 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
              }`}
            >
              {cat.icon}
              {cat.title}
            </button>
          ))}
        </motion.div>

        {/* FAQ Content */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl shadow-slate-200/40 p-5 md:p-6"
        >
          {/* Category Header */}
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
            <div
              className="p-2 rounded-xl"
              style={{
                backgroundColor: `${faqData[activeCategory].color}15`,
                color: faqData[activeCategory].color,
              }}
            >
              {faqData[activeCategory].icon}
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-[16px]">
                {faqData[activeCategory].title}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {faqData[activeCategory].items.length} pertanyaan
              </p>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-3">
            {faqData[activeCategory].items.map((item, i) => (
              <FAQAccordionItem key={item.q} item={item} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Help CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/50 rounded-2xl p-6 md:p-8"
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-800 text-[16px] mb-2">
            Masih ada pertanyaan?
          </h3>
          <p className="text-slate-500 text-[13px] max-w-sm mx-auto mb-4 leading-relaxed">
            Jika pertanyaan Anda belum terjawab, silakan kunjungi SDN 02 Cibadak
            langsung atau hubungi pihak sekolah.
          </p>
          <div className="inline-flex items-center gap-2 bg-white px-5 py-3 rounded-xl border border-emerald-200/60 shadow-sm">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span className="text-[12px] text-slate-600 font-semibold">
              Jl. Kebon Pala 2 Cibadak, Kabupaten Sukabumi
            </span>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="text-center py-8 mt-6">
          <p className="text-[11px] text-slate-400 font-semibold">
            © 2026 SPMB{" "}
            <a
              href="https://www.sdn02cibadak.sch.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              SDN 02 Cibadak
            </a>
            . All rights reserved.
          </p>
          <p className="text-[10px] text-slate-300 mt-1">
            Developed by{" "}
            <a
              href="https://www.ju99erknot.my.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors font-medium"
            >
              @ju99erknot
            </a>
          </p>
        </footer>
      </motion.main>
    </>
  );
}
