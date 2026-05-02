"use client";

import { useState, useEffect, useCallback } from "react";

interface TimeLeft {
  hari: number;
  jam: number;
  menit: number;
  detik: number;
}

export function useCountdown(targetDate: Date | null) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hari: 0,
    jam: 0,
    menit: 0,
    detik: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  const targetTime = targetDate?.getTime();

  const calculateTimeLeft = useCallback(() => {
    if (!targetTime) return;

    const now = new Date().getTime();
    const diff = targetTime - now;

    if (diff <= 0) {
      setIsExpired(prev => prev ? prev : true);
      setTimeLeft(prev => prev.hari === 0 && prev.jam === 0 && prev.menit === 0 && prev.detik === 0 ? prev : { hari: 0, jam: 0, menit: 0, detik: 0 });
      return;
    }

    setIsExpired(prev => prev === false ? prev : false);
    setTimeLeft(prev => {
        const next = {
            hari: Math.floor(diff / (1000 * 60 * 60 * 24)),
            jam: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            menit: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            detik: Math.floor((diff % (1000 * 60)) / 1000),
        };
        // Only update if something actually changed to avoid infinite renders
        if (prev.hari === next.hari && prev.jam === next.jam && prev.menit === next.menit && prev.detik === next.detik) {
            return prev;
        }
        return next;
    });
  }, [targetTime]);

  useEffect(() => {
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  return { timeLeft, isExpired };
}
