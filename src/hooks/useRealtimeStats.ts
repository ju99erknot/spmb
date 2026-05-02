"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase/client";

interface SPMBStats {
  total: number;
  laki: number;
  perempuan: number;
  sisa: number;
  persen: number;
  isLoading: boolean;
}

const MAX_KUOTA = 72;

export function useRealtimeStats() {
  const [stats, setStats] = useState<SPMBStats>({
    total: 0,
    laki: 0,
    perempuan: 0,
    sisa: MAX_KUOTA,
    persen: 0,
    isLoading: true,
  });

  const fetchStats = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("pendaftar_dapodik")
        .select("jk");

      if (error) throw error;

      const total = data?.length || 0;
      const laki = data?.filter((x) => (x.jk || "").toUpperCase() === "L").length || 0;
      const perempuan = total - laki;
      const sisa = Math.max(0, MAX_KUOTA - total);
      const persen = Math.min((total / MAX_KUOTA) * 100, 100);

      setStats({ total, laki, perempuan, sisa, persen, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setStats((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Poll every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    // Realtime subscription
    const channelName = "pendaftar-changes-" + Date.now() + "-" + Math.random();
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pendaftar_dapodik" },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fetchStats]);

  return { stats, refetch: fetchStats };
}
