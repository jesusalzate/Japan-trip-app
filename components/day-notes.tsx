"use client";

import { useState, useTransition } from "react";
import { updateDayNotes } from "@/app/actions";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DayNotes({ id, initial }: { id: string; initial: string | null }) {
  const [value, setValue] = useState(initial ?? "");
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  const dirty = value !== (initial ?? "");

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
        placeholder="Notas del día: reservas, horarios, restaurantes, ideas…"
      />
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          disabled={!dirty || pending}
          onClick={() =>
            start(async () => {
              await updateDayNotes(id, value);
              setSaved(true);
            })
          }
        >
          {pending ? "Guardando…" : "Guardar notas"}
        </Button>
        {saved && !dirty && (
          <span className="text-xs text-success">Guardado ✓</span>
        )}
      </div>
    </div>
  );
}
