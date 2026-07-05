"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Suscribe a los cambios de Postgres (Realtime) y refresca la ruta cuando
 * cualquiera de las tablas del viaje cambia. Así, lo que edita una persona
 * aparece en el móvil de la otra sin recargar.
 */
const TABLES = [
  "tasks",
  "task_subtasks",
  "itinerary_days",
  "itinerary_activities",
  "budget_items",
  "packing_items",
  "documents",
  "trip_settings",
];

export function RealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel("viaje-japon-cambios");

    for (const table of TABLES) {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => router.refresh(),
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
