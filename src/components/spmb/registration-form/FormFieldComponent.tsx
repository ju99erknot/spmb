import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactSelect from "react-select";
import { Calendar, AlertTriangle, Info } from "lucide-react";
import { FormField } from "./types";

export function FormFieldComponent({
  field,
  value,
  error,
  onChange,
}: {
  field: FormField;
  value: string;
  error?: string;
  onChange: (val: string) => void;
}) {
  const hasError = !!error;
  const isValid = value && value.trim() !== "" && !hasError;

  let displayValue = value || "";
  if (field.name.includes("nik") || field.name === "no_kk") {
    displayValue = displayValue.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19);
  } else if (field.name === "hp" || field.name === "telepon") {
    displayValue = displayValue.replace(/\D/g, "");
    if (displayValue.length > 4) {
      displayValue = displayValue.replace(/(\d{4})(\d{1,4})?(\d{1,4})?/, (match, p1, p2, p3) => {
        let res = p1;
        if (p2) res += "-" + p2;
        if (p3) res += "-" + p3;
        return res;
      });
    }
    displayValue = displayValue.slice(0, 15);
  } else if (field.name.includes("nama") || field.name === "tempat_lahir") {
    displayValue = displayValue.toUpperCase();
  }

  let ageWarning = null;
  let ageInfo = null;
  if (field.name === "tanggal_lahir" && value) {
    const lahir = new Date(value);
    const target = new Date("2026-07-01");
    let usia = target.getFullYear() - lahir.getFullYear();
    let m = target.getMonth() - lahir.getMonth();
    if (m < 0 || (m === 0 && target.getDate() < lahir.getDate())) { 
      usia--;
      m = (m + 12) % 12;
    }
    ageInfo = `Umur per 1 Juli 2026: ${usia} Tahun ${m} Bulan`;
    if (usia < 6) {
      ageWarning = "Ananda berusia di bawah 6 tahun. Diwajibkan membawa surat rekomendasi Psikolog / Kepala TK saat daftar ulang.";
    }
  }

  if (field.type === "section_header") {
    return (
      <div className="mt-2 mb-2 p-4 md:p-[15px] bg-[#f0f9ff] border border-[#bae6fd] rounded-[12px] flex items-start gap-3 shadow-sm">
        <div className="bg-white p-2 rounded-full shadow-sm text-[#0284c7] mt-0.5">
          {field.icon}
        </div>
        <div>
          <h4 className="text-[#0369a1] font-extrabold text-[14px] md:text-[15px] tracking-wide mb-1">
            {field.label}
          </h4>
          {field.tip && <p className="text-[12px] text-[#0284c7] opacity-90 leading-tight">{field.tip}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 scroll-mt-24" id={`field-${field.name}`}>
      <Label className="flex items-center gap-2 mb-2 text-[13px] font-bold text-slate-700 tracking-wide">
        <span className="text-emerald-500">{field.icon}</span>
        {field.label}
        {field.required && <span className="text-red-400 text-xs">*</span>}
        {field.tip && (
            <span className="group relative ml-1 cursor-help hidden md:inline-block">
              <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-medium rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 shadow-[0_15px_30px_rgba(0,0,0,0.2)] border border-white/10">
                {field.tip}
                <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1.5 w-3 h-3 bg-slate-900/90 rotate-45 border-r border-b border-white/10" />
              </span>
            </span>
          )}
      </Label>
      
      {field.tip && (
          <p className="text-[10px] text-slate-400 mb-2 md:hidden italic leading-tight">{field.tip}</p>
      )}

      {field.type === "select" ? (
        (field.name === "kecamatan" || field.name === "kelurahan" || (field.options && field.options.length > 10)) ? (
          <ReactSelect
            value={value ? { value: value, label: value } : null}
            onChange={(val: any) => onChange(val ? val.value : "")}
            options={field.options?.map((opt) => {
              const optValue = typeof opt === "string" ? opt : opt.value;
              const optLabel = typeof opt === "string" ? opt : opt.label;
              return { value: optValue, label: optLabel };
            })}
            placeholder={`Ketik untuk mencari ${field.label}...`}
            noOptionsMessage={() => "Tidak ditemukan"}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: '54px',
                borderRadius: '12px',
                borderWidth: '2px',
                borderColor: hasError ? '#f87171' : isValid ? '#34d399' : state.isFocused ? '#10b981' : '#e2e8f0',
                backgroundColor: hasError ? '#fef2f2' : '#f8fafc',
                boxShadow: state.isFocused ? '0 0 0 4px rgba(16,185,129,0.15)' : 'none',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.3s',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: state.isFocused ? '#10b981' : '#cbd5e1',
                  backgroundColor: '#ffffff'
                }
              }),
              menu: (base) => ({
                ...base,
                borderRadius: '16px',
                padding: '6px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)',
                backgroundColor: 'rgba(255,255,255,0.98)',
                backdropFilter: 'blur(16px)',
                zIndex: 50
              }),
              option: (base, state) => ({
                ...base,
                borderRadius: '10px',
                padding: '12px 14px',
                margin: '2px 0',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#ecfdf5' : 'transparent',
                color: state.isSelected ? '#ffffff' : state.isFocused ? '#064e3b' : '#334155',
                transition: 'all 0.2s'
              }),
              input: (base) => ({ ...base, color: '#1e293b' }),
              placeholder: (base) => ({ ...base, color: '#94a3b8' })
            }}
          />
        ) : (
          <Select value={value} onValueChange={(val) => onChange(val || "")}>
            <SelectTrigger 
              className={`w-full px-[16px] py-[14px] !h-auto min-h-[54px] rounded-[12px] border-2 bg-slate-50 text-[14px] md:text-[15px] font-medium text-slate-800 transition-all duration-300 outline-none cursor-pointer data-[state=open]:border-emerald-500 data-[state=open]:bg-white data-[state=open]:shadow-[0_0_0_4px_rgba(16,185,129,0.15)] data-[state=open]:-translate-y-0.5
                ${hasError ? "border-red-400 bg-red-50" : isValid ? "border-emerald-400" : "border-slate-200"}
                hover:bg-white hover:border-slate-300 hover:shadow-sm hover:-translate-y-px`}
            >
              <SelectValue placeholder={`-- Pilih ${field.label} --`} />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} sideOffset={8} className="rounded-[16px] border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] bg-white/95 backdrop-blur-xl p-1.5 max-h-[300px] overflow-y-auto">
              {field.options?.map((opt) => {
                const optValue = typeof opt === "string" ? opt : opt.value;
                const optLabel = typeof opt === "string" ? opt : opt.label;
                return (
                  <SelectItem key={optValue} value={optValue} className="rounded-[10px] cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50 focus:text-emerald-900 font-semibold text-[14px] py-[12px] px-[14px] my-0.5 transition-colors">
                    {optLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )
      ) : field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          rows={3}
          className={`w-full px-[16px] py-[14px] rounded-[12px] border-2 bg-slate-50 text-[14px] md:text-[15px] transition-all duration-300 resize-none
            ${hasError ? "border-red-400 bg-red-50" : isValid ? "border-emerald-400" : "border-slate-200"}
            hover:bg-white hover:border-slate-300 hover:shadow-sm
            focus:border-emerald-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(16,185,129,0.15)] focus-visible:outline-none`}
        />
      ) : (
          <input
            type={field.type || "text"}
            inputMode={(field.name.includes("nik") || field.name === "no_kk" || field.name === "hp" || field.name === "telepon" || field.type === "number") ? "numeric" : undefined}
            value={displayValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            maxLength={(field.name.includes("nik") || field.name === "no_kk") ? 19 : (field.name === "hp" || field.name === "telepon") ? 15 : field.maxLength}
            className={`w-full px-[16px] py-[14px] rounded-[12px] border-2 bg-slate-50 text-[14px] md:text-[15px] transition-all duration-300 outline-none
              ${hasError ? "border-red-400 bg-red-50" : isValid ? "border-emerald-400" : "border-slate-200"}
              hover:bg-white hover:border-slate-300 hover:shadow-sm hover:-translate-y-px
              focus:border-emerald-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(16,185,129,0.15)] focus:-translate-y-0.5`}
          />
      )}

      {/* Dynamic Age Info */}
      <AnimatePresence>
        {ageInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2"
          >
            <div className="text-[12px] font-bold text-emerald-600 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-100 inline-flex items-center gap-1.5 shadow-sm">
              <Calendar className="w-3.5 h-3.5" />
              {ageInfo}
            </div>
            
            {ageWarning && (
              <div className="mt-2 text-[11px] font-semibold text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-start gap-2 leading-snug">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{ageWarning}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-1 mt-1.5 text-[11px] text-red-500 font-semibold"
          >
            <AlertTriangle className="w-3 h-3" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
