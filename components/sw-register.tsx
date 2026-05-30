"use client";

import { useEffect } from "react";

/** Registra el service worker para que la app sea instalable (PWA). */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silencioso: la app funciona igual sin SW.
      });
    }
  }, []);

  return null;
}
