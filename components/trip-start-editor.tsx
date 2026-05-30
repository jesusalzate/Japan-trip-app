"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { updateTripStart } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** Permite ajustar la fecha de salida; todas las fechas del itinerario se recalculan. */
export function TripStartEditor({
  id,
  startDate,
}: {
  id: string;
  startDate: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(startDate);
  const [pending, start] = useTransition();

  if (!id) return null; // sin fila de ajustes (datos no cargados)

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-2 inline-flex items-center gap-1 text-xs text-white/80 underline-offset-2 hover:underline"
      >
        <Pencil className="h-3 w-3" /> Cambiar fecha de salida
      </button>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <Input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-9 max-w-[10rem] bg-white text-foreground"
      />
      <Button
        size="sm"
        variant="secondary"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await updateTripStart(id, value);
            setOpen(false);
          })
        }
      >
        Guardar
      </Button>
    </div>
  );
}
