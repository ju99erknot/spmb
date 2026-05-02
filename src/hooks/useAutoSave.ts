"use client";

import { useEffect, useCallback } from "react";
import { toast } from "sonner";

const DRAFT_KEY = "spmb_draft_v2";

export function useAutoSave(formData: Record<string, string>) {
  const save = useCallback(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      toast("✓ Draft tersimpan otomatis", { duration: 1500 });
    } catch {
      // localStorage might be full
    }
  }, [formData]);

  // Auto-save on data change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.values(formData).some((v) => v && v.trim() !== "")) {
        save();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [formData, save]);

  return { save };
}

export function loadDraft(): Record<string, string> {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}
