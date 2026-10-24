"use client";

import { useEffect, useState } from "react";

export function FooterYear({ initialYear }: { initialYear: number }) {
  const [year, setYear] = useState(initialYear);

  useEffect(() => {
    const refreshYear = () => setYear(new Date().getFullYear());
    refreshYear();

    const interval = window.setInterval(refreshYear, 60_000);
    document.addEventListener("visibilitychange", refreshYear);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshYear);
    };
  }, []);

  return <>{year}</>;
}
