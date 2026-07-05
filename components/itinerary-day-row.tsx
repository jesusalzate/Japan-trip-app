"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ChevronRight, MapPin, Plus, Trash2, TrainFront } from "lucide-react";
import { addItineraryDay, deleteItineraryDay } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { cityColor } from "@/lib/trip";
import { cn } from "@/lib/utils";
import type { ItineraryDay } from "@/lib/types";

export function ItineraryDayRow({
  day,
  dateLabel,
}: {
  day: ItineraryDay;
  dateLabel: string;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onInsert() {
    start(async () => {
      setError(null);
      try {
        await addItineraryDay(day.day_number);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido");
      }
    });
  }

  function onDelete() {
    const ok = window.confirm(
      `¿Eliminar "Día ${day.day_number} · ${day.title}"?\n\nSe borrarán también sus actividades y notas, y los días siguientes se renumerarán.`,
    );
    if (!ok) return;
    start(async () => {
      setError(null);
      try {
        await deleteItineraryDay(day.day_number);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido");
      }
    });
  }

  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-1 rounded-lg border border-border bg-card transition-opacity",
          pending && "pointer-events-none opacity-50",
        )}
      >
        <Link
          href={`/itinerario/${day.day_number}`}
          className="flex min-w-0 flex-1 items-center gap-3 p-3 transition-colors hover:bg-muted"
        >
          <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-md bg-primary/10 text-primary">
            <span className="text-[10px] font-medium uppercase">Día</span>
            <span className="text-lg font-bold leading-none">
              {day.day_number}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {day.city && (
                <Badge className={cn("shrink-0", cityColor(day.city))}>
                  <MapPin className="mr-0.5 h-3 w-3" />
                  {day.city}
                </Badge>
              )}
              <span className="truncate text-xs text-muted-foreground">
                {dateLabel}
              </span>
            </div>
            <p className="mt-1 truncate text-sm font-medium">{day.title}</p>
            {day.summary && (
              <p className="truncate text-xs text-muted-foreground">
                {day.summary}
              </p>
            )}
            {day.transport && (
              <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                <TrainFront className="h-3 w-3 shrink-0" />
                {day.transport}
              </p>
            )}
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>

        <div className="flex shrink-0 flex-col gap-2 pr-3">
          <button
            onClick={onInsert}
            disabled={pending}
            className="text-muted-foreground hover:text-primary"
            aria-label="Insertar día después"
            title="Insertar día después"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={pending}
            className="text-muted-foreground hover:text-danger"
            aria-label="Eliminar día"
            title="Eliminar día"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-1.5 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      )}
    </li>
  );
}
