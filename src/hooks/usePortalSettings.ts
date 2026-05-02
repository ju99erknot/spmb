"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";

interface PortalSettings {
  jadwalBuka: string | null;
  jadwalTutup: string | null;
  maintenance: boolean;
  isLoading: boolean;
}

export function usePortalSettings() {
  const [settings, setSettings] = useState<PortalSettings>({
    jadwalBuka: null,
    jadwalTutup: null,
    maintenance: false,
    isLoading: true,
  });

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("pengaturan")
        .select("nama_setting, status")
        .in("nama_setting", ["jadwal_buka", "jadwal_tutup", "maintenance"]);

      if (error) throw error;

      let jadwalBuka = null;
      let jadwalTutup = null;
      let maintenance = false;

      data?.forEach((row) => {
        if (row.nama_setting === "jadwal_buka") jadwalBuka = row.status;
        if (row.nama_setting === "jadwal_tutup") jadwalTutup = row.status;
        if (row.nama_setting === "maintenance") maintenance = row.status === "ON";
      });

      setSettings({ jadwalBuka, jadwalTutup, maintenance, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      setSettings((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    // Poll every 30 seconds
    const interval = setInterval(fetchSettings, 30000);

    // Realtime subscription
    const channelName = "pengaturan-changes-" + Date.now() + "-" + Math.random();
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pengaturan" },
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fetchSettings]);

  return { settings, refetch: fetchSettings, isLoading: settings.isLoading };
}
