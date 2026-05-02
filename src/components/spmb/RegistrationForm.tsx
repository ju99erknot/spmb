"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useFormWizard } from "@/hooks/useFormWizard";
import { useAutoSave, loadDraft, clearDraft } from "@/hooks/useAutoSave";
import { StepProgress } from "./StepProgress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactSelect from "react-select";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use"; // we might not have it, we can just use window.innerWidth
import { toast } from "sonner";
import { SuccessScreen } from "./registration-form/SuccessScreen";
import { FormFieldComponent } from "./registration-form/FormFieldComponent";
import { 
  step1Fields, 
  step2Fields, 
  step3Fields, 
  step4Fields, 
  step5Fields, 
  step6Fields, 
  step7Fields, 
  step8Fields 
} from "./registration-form/config";
import {
  Calendar,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Send,
  BookOpen,
  Heart,
  Baby,
  Briefcase,
  Home,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Info,
  Map,
  FileCheck,
  FileText,
  CreditCard,
  User,
  MapPin,
  Phone,
  Users,
  School
} from "lucide-react";

export function RegistrationForm() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);
  const [villages, setVillages] = useState<{ id: string; name: string }[]>([]);

  const totalSteps = 8;
  const wizard = useFormWizard({
    totalSteps,
    onStepChange: () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  useAutoSave(formData);

  // Load draft on mount and fetch districts
  useEffect(() => {
    const draft = loadDraft();
    if (Object.keys(draft).length > 0) {
      setFormData(draft);
    }
    
    // Fetch districts (Sukabumi ID: 3202)
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/districts/3202.json")
      .then(res => res.json())
      .then(data => setDistricts(data))
      .catch(err => console.error("Failed to load districts:", err));
  }, []);

  // Fetch villages when draft has kecamatan
  useEffect(() => {
    if (districts.length > 0 && formData.kecamatan && villages.length === 0) {
        const district = districts.find(d => d.name === formData.kecamatan);
        if (district) {
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${district.id}.json`)
              .then(res => res.json())
              .then(data => setVillages(data))
              .catch(err => console.error("Failed to load villages:", err));
        }
    }
  }, [districts, formData.kecamatan, villages.length]);

  const handleChange = (name: string, value: string) => {
    // Upper case text fields handling
    let finalValue = value;
    if (name === "nama" || name === "nama_ayah" || name === "nama_ibu" || name === "nama_wali") {
        finalValue = value.toUpperCase();
    }
    
    // NIK validation handling - numeric only
    if (name.includes("nik") || name === "no_kk" || name === "hp" || name === "telepon") {
        finalValue = value.replace(/[^0-9]/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    
    // Load villages if kecamatan changes
    if (name === "kecamatan") {
        setFormData((prev) => ({ ...prev, kelurahan: "" })); // Reset kelurahan
        setVillages([]);
        const district = districts.find(d => d.name === value);
        if (district) {
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${district.id}.json`)
              .then(res => res.json())
              .then(data => setVillages(data))
              .catch(err => console.error("Failed to load villages:", err));
        }
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Browser Anda tidak mendukung fitur GPS.");
      return;
    }
    
    toast.info("Mengambil lokasi GPS...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          lintang: position.coords.latitude.toString(),
          bujur: position.coords.longitude.toString()
        }));
        toast.success("Lokasi GPS berhasil diambil!");
      },
      (error) => {
        toast.error("Gagal mengambil lokasi. Pastikan izin lokasi (GPS) diaktifkan.");
      }
    );
  };

  const validateStep = (stepIdx: number): boolean => {
    const stepConfigList = [step1Fields, step2Fields, step3Fields, step4Fields, step5Fields, step6Fields, step7Fields, step8Fields];
    const currentFields = stepConfigList[stepIdx - 1];
    const newErrors: Record<string, string> = {};
    
    // Age Validation for Step 1
    if (stepIdx === 1) {
        const tglLahir = formData.tanggal_lahir;
        if (tglLahir) {
            const lahir = new Date(tglLahir);
            const target = new Date("2026-07-01");
            let usia = target.getFullYear() - lahir.getFullYear();
            const m = target.getMonth() - lahir.getMonth();
            if (m < 0 || (m === 0 && target.getDate() < lahir.getDate())) { usia--; }
            
            if (usia < 6) {
                newErrors.tanggal_lahir = `Usia minimal 6 tahun per 1 Juli 2026. Usia anak saat ini: ${usia} tahun.`;
                toast.error("Maaf, umur belum cukup!");
            }
        }
    }

      currentFields.forEach((f) => {
        if (f.required) {
          const val = (formData[f.name] || "").trim();
          if (!val) {
            newErrors[f.name] = "Kolom ini wajib diisi";
          } else if (f.name.includes("nik") || f.name === "no_kk") {
            const rawVal = val.replace(/\D/g, "");
            if (rawVal.length !== 16) {
              newErrors[f.name] = `${f.label.split("(")[0]} harus 16 digit`;
            }
          }
        }
      });

    // Cross-NIK validation
    if (stepIdx === 6 || stepIdx === 7) {
        const nSiswa = formData.nik;
        const nIbu = formData.nik_ibu;
        const nAyah = formData.nik_ayah;
        
        if (nIbu && nSiswa && nIbu === nSiswa) newErrors.nik_ibu = "NIK Ibu tidak boleh sama dengan NIK Anak";
        if (nAyah && nSiswa && nAyah === nSiswa) newErrors.nik_ayah = "NIK Ayah tidak boleh sama dengan NIK Anak";
        if (nIbu && nAyah && nIbu === nAyah) {
            newErrors.nik_ibu = "NIK Ibu dan Ayah tidak boleh sama";
            newErrors.nik_ayah = "NIK Ibu dan Ayah tidak boleh sama";
        }
    }

      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        toast.error("Mohon perbaiki isian form yang berwarna merah.");
        
        // Auto-Scroll to Error UX
        setTimeout(() => {
          const firstErrorField = Object.keys(newErrors)[0];
          const errorElement = document.getElementById(`field-${firstErrorField}`);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
            const inputElement = errorElement.querySelector("input, textarea, select, .react-select-container") as HTMLElement;
            if (inputElement) {
              const originalBoxShadow = inputElement.style.boxShadow;
              inputElement.style.boxShadow = "0 0 0 4px rgba(248, 113, 113, 0.4)";
              setTimeout(() => {
                if (inputElement) inputElement.style.boxShadow = originalBoxShadow;
              }, 1500);
            }
          }
        }, 100);
        
        return false;
      }
      return true;
  };

  const handleNext = async () => {
    if (validateStep(wizard.currentStep)) {
        // Additional Check for Step 1: Duplicate NIK in Database
        if (wizard.currentStep === 1) {
            setIsSubmitting(true);
            try {
                const cleanNik = formData.nik?.replace(/\D/g, "");
                const { data, error } = await supabase
                    .from("pendaftar_dapodik")
                    .select("id, nama")
                    .eq("nik", cleanNik);
                
                if (error) throw error;
                if (data && data.length > 0) {
                    toast.error(`NIK ${formData.nik} sudah terdaftar atas nama ${data[0].nama}.`);
                    setErrors({ nik: "NIK ini sudah terdaftar" });
                    setIsSubmitting(false);
                    return;
                }
            } catch (err) {
                toast.error("Gagal mengecek NIK ke server.");
                setIsSubmitting(false);
                return;
            }
            setIsSubmitting(false);
        }

      wizard.nextStep();
    }
  };

  const handleReprint = async () => {
    const rawNik = formData.nik;
    const cleanNik = rawNik ? rawNik.replace(/\D/g, "") : "";
    if (!cleanNik || cleanNik.length < 16) {
      toast.error("INFO: Anda wajib memasukkan 16 Digit NIK sebelum bisa mencetak struk mandiri.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("pendaftar_dapodik")
        .select("*")
        .eq("nik", cleanNik)
        .limit(1);
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.info("SEDIKIT LAGI: NIK ini belum terdaftar di sistem. Silakan lanjut selesaikan formulir pendaftaran ini.");
      } else {
        const dbData = data[0];
        const newFormData = { ...formData };
        Object.keys(dbData).forEach(key => {
          if (dbData[key] !== null) newFormData[key] = String(dbData[key]);
        });
        
        if (dbData.id) newFormData.database_id = String(dbData.id);
        
        setFormData(newFormData);
        setSubmitted(true);
        toast.success("Berhasil mengambil data pendaftaran!");
      }
    } catch (err) {
      toast.error("Gagal mengambil data dari server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!agreed) {
      toast.error("Harap centang pernyataan terlebih dahulu");
      return;
    }
    
    // One final validation pass for step 8
    if (!validateStep(8)) return;

    setIsSubmitting(true);
    try {
        // Pre-process data types
        const payload = {
            ...formData,
            nik: formData.nik ? formData.nik.replace(/\D/g, "") : null,
            nik_ayah: formData.nik_ayah ? formData.nik_ayah.replace(/\D/g, "") : null,
            nik_ibu: formData.nik_ibu ? formData.nik_ibu.replace(/\D/g, "") : null,
            nik_wali: formData.nik_wali ? formData.nik_wali.replace(/\D/g, "") : null,
            no_kk: formData.no_kk ? formData.no_kk.replace(/\D/g, "") : null,
            hp: formData.hp ? formData.hp.replace(/\D/g, "") : null,
            telepon: formData.telepon ? formData.telepon.replace(/\D/g, "") : null,
            anak_ke: formData.anak_ke ? parseInt(formData.anak_ke) : null,
            jarak_sekolah: formData.jarak_sekolah ? parseInt(formData.jarak_sekolah) : null,
            berat_badan: formData.berat_badan ? parseInt(formData.berat_badan) : null,
            tinggi_badan: formData.tinggi_badan ? parseInt(formData.tinggi_badan) : null,
            lingkar_kepala: formData.lingkar_kepala ? parseInt(formData.lingkar_kepala) : null,
            jml_saudara: formData.jml_saudara ? parseInt(formData.jml_saudara) : null,
            status_pendaftaran: 'Tahap 1'
        };

      const { data, error } = await supabase.from("pendaftar_dapodik").insert([payload]).select("id").single();
      if (error) throw error;
      
      clearDraft();
      
      // Store the returned ID into formData for the success screen
      setFormData(prev => ({...prev, database_id: data.id.toString()}));
      setSubmitted(true);
      toast.success("Pendaftaran berhasil dikirim! 🎉");
    } catch (err: any) {
      toast.error(err?.message || "Gagal mengirim data. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return <SuccessScreen formData={formData} />;
  }

  if (!isStarted) {
    return (
      <Card className="border-t-[5px] border-t-emerald-500 shadow-2xl rounded-2xl overflow-hidden mb-8 bg-white/60 backdrop-blur-xl border border-white/60">
        <CardContent className="p-6 md:p-10">
          <div className="text-center mb-8">
            <div className="w-[65px] h-[65px] bg-[#f0fbf7] rounded-full border-2 border-[#d1f2e6] mx-auto mb-4 flex items-center justify-center">
              <FileCheck className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="m-0 text-slate-900 text-[1.4rem] font-extrabold tracking-[0.5px]">PERSIAPAN PENDAFTARAN</h3>
            <p className="text-sm text-slate-500 mt-2">Tonton panduan dan siapkan dokumen asli berikut:</p>
          </div>

          <div className="relative w-full h-0 pb-[56.25%] rounded-2xl overflow-hidden mb-5 border border-slate-200 shadow-sm">
            <iframe
              allow="autoplay; fullscreen"
              className="absolute top-0 left-0 w-full h-full border-none"
              src="https://www.youtube.com/embed/y0aWuBRBreA?rel=0"
              title="Panduan SPMB"
            />
          </div>

          <a
            href="https://drive.google.com/file/d/1qLtAdO3bLfMTT3jzRewPGMIkfSX47HO0/view"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full text-center bg-[#f0fbf7] text-emerald-500 hover:bg-emerald-500 hover:text-white p-3 rounded-xl font-bold text-sm mb-8 border-2 border-dashed border-emerald-500 transition-all duration-300"
          >
            <FileText className="w-4 h-4" /> UNDUH BUKU SAKU PANDUAN (PDF)
          </a>

          <div className="grid gap-4 mb-8">
            <div className="flex items-center gap-5 p-4 md:p-5 bg-[#fbfcfd] rounded-2xl border border-slate-100">
              <div className="w-10 text-center flex justify-center">
                <FileText className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="leading-snug">
                <b className="block text-slate-900 text-[15px]">Akta Kelahiran</b>
                <span className="text-slate-500 text-[13px]">Untuk cek Nama & TTL</span>
              </div>
            </div>

            <div className="flex items-center gap-5 p-4 md:p-5 bg-[#fbfcfd] rounded-2xl border border-slate-100">
              <div className="w-10 text-center flex justify-center">
                <CreditCard className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="leading-snug">
                <b className="block text-slate-900 text-[15px]">Kartu Keluarga (KK)</b>
                <span className="text-slate-500 text-[13px]">Untuk cek NIK & Alamat</span>
              </div>
            </div>

            <div className="flex items-center gap-5 p-4 md:p-5 bg-[#fbfcfd] rounded-2xl border border-slate-100">
              <div className="w-10 text-center flex justify-center">
                <GraduationCap className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="leading-snug">
                <b className="block text-slate-900 text-[15px]">Ijazah TK / Surat Keterangan</b>
                <span className="text-slate-500 text-[13px]">(Opsional)</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsStarted(true)}
            className="w-full h-auto py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl text-base font-extrabold shadow-[0_10px_25px_rgba(16,185,129,0.3)] transition-all tracking-[1px] cursor-pointer"
          >
            SAYA SIAP, MULAI ISI FORMULIR
          </Button>
        </CardContent>
      </Card>
    );
  }

  const stepConfig = [
    { fields: step1Fields, title: "Identitas Peserta Didik", shortTitle: "Identitas", icon: <User className="w-5 h-5 text-sky-500" /> },
    { fields: step2Fields, title: "Alamat Domisili", shortTitle: "ke Alamat", icon: <MapPin className="w-5 h-5 text-orange-500" /> },
    { fields: step3Fields, title: "Kontak & Data Fisik", shortTitle: "Kontak", icon: <Phone className="w-5 h-5 text-purple-500" /> },
    { fields: step4Fields, title: "Dokumen & Kesejahteraan", shortTitle: "Dokumen", icon: <FileText className="w-5 h-5 text-amber-500" /> },
    { fields: step5Fields, title: "Data Ayah", shortTitle: "Data Ayah", icon: <User className="w-5 h-5 text-blue-500" /> },
    { fields: step6Fields, title: "Data Ibu Kandung", shortTitle: "Data Ibu", icon: <User className="w-5 h-5 text-pink-500" /> },
    { fields: step7Fields, title: "Data Wali", shortTitle: "Data Wali", icon: <Users className="w-5 h-5 text-teal-500" /> },
    { fields: step8Fields, title: "Akademik & Pernyataan", shortTitle: "Terakhir", icon: <GraduationCap className="w-5 h-5 text-indigo-500" /> },
  ];

  return (
    <Card className="border-t-[5px] border-t-emerald-500 shadow-2xl rounded-2xl overflow-hidden mb-8 bg-white/60 backdrop-blur-xl border border-white/60">
      <CardContent className="p-4 md:p-8">
        <StepProgress
          currentStep={wizard.currentStep}
          totalSteps={wizard.totalSteps}
          completedSteps={wizard.completedSteps}
        />

        <AnimatePresence mode="wait">
          {wizard.currentStep <= 8 ? (
              <motion.div
                key={wizard.currentStep}
                initial={{ opacity: 0, x: wizard.direction === "next" ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: wizard.direction === "next" ? -40 : 40 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              >
                <div className="mb-6 relative pb-3 border-b border-slate-100">
                  <h3 className="flex items-center gap-3 text-base md:text-lg font-extrabold text-slate-900 mb-0">
                    {stepConfig[wizard.currentStep - 1].icon}
                    {stepConfig[wizard.currentStep - 1].title}
                  </h3>
                  {/* Visual Accent Line */}
                  <div className="absolute bottom-[-1px] left-0 w-16 h-[3px] bg-emerald-500 rounded-full" />
                </div>

                {/* Informational Alerts */}
              {wizard.currentStep === 5 && (
                  <div className="text-xs text-slate-500 mb-4 bg-sky-50 p-3 rounded-xl border border-sky-200 flex items-start gap-2">
                      <Info className="w-4 h-4 text-sky-500 shrink-0" />
                      Semua kolom opsional. Isi sesuai KK. Jika ayah meninggal, tetap isi namanya.
                  </div>
              )}
              {wizard.currentStep === 7 && (
                  <div className="text-xs text-slate-500 mb-4 bg-teal-50 p-3 rounded-xl border border-teal-200 flex items-start gap-2">
                      <Info className="w-4 h-4 text-teal-500 shrink-0" />
                      Semua kolom opsional. Isi hanya jika anak tinggal bersama wali (bukan orang tua kandung).
                  </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                {stepConfig[wizard.currentStep - 1].fields.filter(f => !f.group).map((field) => {
                  let dynamicOptions = field.options;
                  if (field.name === "kecamatan") {
                      dynamicOptions = districts.map(d => d.name);
                  } else if (field.name === "kelurahan") {
                      dynamicOptions = villages.map(v => v.name);
                  }
                  
                  return (
                  <div
                    key={field.name}
                    className={field.colSpan === 2 ? "md:col-span-2" : ""}
                  >
                    <FormFieldComponent
                      field={{...field, options: dynamicOptions}}
                      value={formData[field.name] || ""}
                      error={errors[field.name]}
                      onChange={(val) => handleChange(field.name, val)}
                    />
                    {field.name === "nik" && (
                      <a 
                        onClick={handleReprint}
                        className="text-[11px] text-emerald-500 font-bold decoration-transparent cursor-pointer flex items-center gap-1.5 mt-[-10px] mb-[15px] hover:text-emerald-600 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" /> Lupa simpan bukti? Cetak ulang di sini
                      </a>
                    )}
                  </div>
                  );
                })}
              </div>

              {/* Data Bantuan Group (Step 4) */}
              {stepConfig[wizard.currentStep - 1].fields.some(f => f.group === "bantuan") && (
                <div className="mt-6 mb-6 p-4 md:p-[20px] bg-[#f0f9ff] border border-[#bae6fd] rounded-[16px]">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-white p-2 rounded-full shadow-sm text-[#0284c7]">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[#0369a1] font-extrabold text-[15px] md:text-[16px] tracking-wide mb-1">
                        Data Bantuan
                      </h4>
                      <p className="text-[12px] text-[#0284c7] opacity-90 leading-tight">Opsional - Isi jika menerima bantuan KPS / KIP / KKS / PIP</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                    {stepConfig[wizard.currentStep - 1].fields.filter(f => f.group === "bantuan").map((field) => (
                      <div key={field.name} className={field.colSpan === 2 ? "md:col-span-2" : ""}>
                        <FormFieldComponent
                          field={field}
                          value={formData[field.name] || ""}
                          error={errors[field.name]}
                          onChange={(val) => handleChange(field.name, val)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Asal Sekolah Group (Step 8) */}
              {stepConfig[wizard.currentStep - 1].fields.some(f => f.group === "sekolah") && (
                <div className="mt-6 mb-6 p-4 md:p-[20px] bg-[#f0f9ff] border border-[#bae6fd] rounded-[16px]">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-white p-2 rounded-full shadow-sm text-[#0284c7]">
                      <School className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[#0369a1] font-extrabold text-[15px] md:text-[16px] tracking-wide mb-1">
                        Data Asal Sekolah
                      </h4>
                      <p className="text-[12px] text-[#0284c7] opacity-90 leading-tight">Opsional - Isi jika anak berasal dari TK/PAUD</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                    {stepConfig[wizard.currentStep - 1].fields.filter(f => f.group === "sekolah").map((field) => (
                      <div key={field.name} className={field.colSpan === 2 ? "md:col-span-2" : ""}>
                        <FormFieldComponent
                          field={field}
                          value={formData[field.name] || ""}
                          error={errors[field.name]}
                          onChange={(val) => handleChange(field.name, val)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GPS Button Injection for Step 2 */}
              {wizard.currentStep === 2 && (
                  <div className="mt-4 mb-6 p-4 md:p-[15px] bg-[#f0f9ff] border border-[#bae6fd] rounded-[12px]">
                      <label className="flex items-center gap-2 mb-2 text-[14px] font-bold text-slate-900">
                        <MapPin className="w-4 h-4 text-[#0284c7]" /> Koordinat GPS *
                        <div className="group relative inline-flex">
                          <Info className="w-3.5 h-3.5 text-[#0284c7] cursor-help" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[200px] bg-slate-800 text-white text-[10px] rounded py-1 px-2 text-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">Wajib diisi. Klik tombol di bawah untuk mengisi otomatis.</span>
                        </div>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input name="lintang" value={formData.lintang || ""} readOnly required placeholder="Lintang (Latitude)" className="w-full bg-white border-2 border-slate-200 py-[14px] px-[16px] rounded-[12px] text-[14px] font-medium outline-none" />
                        <input name="bujur" value={formData.bujur || ""} readOnly required placeholder="Bujur (Longitude)" className="w-full bg-white border-2 border-slate-200 py-[14px] px-[16px] rounded-[12px] text-[14px] font-medium outline-none" />
                      </div>
                      <button onClick={getGPSLocation} type="button" className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-[10px] font-bold text-[14px] py-[16px] flex justify-center items-center gap-2 cursor-pointer border-none outline-none transition-colors">
                          <MapPin className="w-4 h-4" /> Ambil Lokasi Saya Sekarang
                      </button>
                      <p className="text-[10px] text-[#64748b] mt-2 text-center">Klik tombol di atas saat Anda berada di rumah untuk mengisi otomatis.</p>
                  </div>
              )}

              {/* Step 8 Content - Review and Submit */}
              {wizard.currentStep === 8 && (
                <div className="mt-8">
                  <div className="bg-slate-50 border-2 border-dashed border-sky-300 rounded-xl p-4 md:p-6 mb-6">
                    <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                      <CheckCircle2 className="w-5 h-5 text-sky-500" />
                      Verifikasi Data Utama:
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Nama Lengkap:</span>
                        <strong className="text-slate-900 text-right">{formData.nama || "-"}</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">NIK Siswa:</span>
                        <strong className="text-slate-900 font-mono">{formData.nik || "-"}</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Tempat, Tgl Lahir:</span>
                        <strong className="text-slate-900 text-right">{(formData.tempat_lahir || "-") + ", " + (formData.tanggal_lahir || "-")}</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Nama Ibu Kandung:</span>
                        <strong className="text-slate-900 text-right">{formData.nama_ibu || "-"}</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">No. WhatsApp:</span>
                        <strong className="text-emerald-600 font-mono">{formData.hp || "-"}</strong>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-slate-500">Domisili:</span>
                        <strong className="text-slate-900 text-right text-xs max-w-[65%] leading-relaxed">
                          {formData.alamat ? `${formData.alamat}, RT ${formData.rt || "-"} RW ${formData.rw || "-"}, ${formData.kelurahan || "-"}, ${formData.kecamatan || "-"}` : "-"}
                        </strong>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <p><b>PENTING:</b> Jika data di atas masih salah, silakan klik tombol <b>KEMBALI</b> untuk memperbaiki sebelum mengirim.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 md:p-5 mb-6">
                    <input
                      type="checkbox"
                      id="agree"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-5 h-5 accent-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="agree" className="text-[13px] text-slate-700 font-medium leading-relaxed cursor-pointer">
                      <b className="text-slate-900 block mb-1">SAYA MENYATAKAN BENAR:</b> 
                      Bahwa data yang saya isikan di atas adalah sesuai dengan dokumen asli (Akta/KK). Saya bersedia membawa <b>Fotocopy Berkas Fisik</b> saat daftar ulang sesuai instruksi panitia.
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col-reverse md:flex-row gap-3 mt-8">
                {!wizard.isFirstStep && (
                  <button
                    type="button"
                    onClick={wizard.prevStep}
                    disabled={isSubmitting}
                    className="flex-1 py-[14px] md:py-[18px] rounded-[12px] font-bold text-[14px] text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer outline-none transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    <span>Kembali</span>
                  </button>
                )}
                
                {wizard.currentStep < totalSteps ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="group relative overflow-hidden flex-[2] py-[14px] md:py-[18px] rounded-[12px] font-extrabold text-[14px] md:text-[15px] uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_8px_25px_rgba(16,185,129,0.25)] hover:-translate-y-0.5 transition-all cursor-pointer outline-none flex items-center justify-center disabled:opacity-50 border-none"
                      >
                        {/* Shimmer Effect */}
                        {!isSubmitting && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[20deg] animate-[shimmer_3s_infinite] group-hover:animate-[shimmer_1.5s_infinite]" />}
                        <div className="relative z-10 flex items-center justify-center gap-2">
                          {isSubmitting ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Memproses...
                            </>
                          ) : (
                            <>Lanjut {stepConfig[wizard.currentStep].shortTitle} <ChevronRight className="w-4 h-4 ml-1" /></>
                          )}
                        </div>
                      </button>
                  ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!agreed || isSubmitting}
                        className="group relative overflow-hidden flex-[2] py-[14px] md:py-[18px] rounded-[12px] font-extrabold text-[15px] md:text-[16px] uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_8px_25px_rgba(16,185,129,0.25)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 cursor-pointer outline-none flex items-center justify-center border-none"
                      >
                        {/* Shimmer Effect */}
                        {!isSubmitting && agreed && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[20deg] animate-[shimmer_3s_infinite] group-hover:animate-[shimmer_1.5s_infinite]" />}
                        <div className="relative z-10 flex items-center justify-center gap-2">
                          {isSubmitting ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Mengirim...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Kirim Pendaftaran
                            </>
                          )}
                        </div>
                      </button>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

/* === Sub Components === */

