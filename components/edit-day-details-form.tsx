"use client";

import { useState, useTransition } from "react";
import { Pencil, X } from "lucide-react";
import { updateDayDetails } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export function EditDayDetailsForm({
  id,
  title,
  city,
  summary,
}: {
  id: string;
  title: string;
  city: string | null;
  summary: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [values, setValues] = useState({
    title,
    city: city ?? "",
    summary: summary ?? "",
  });

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <Pencil className="h-3.5 w-3.5" /> Editar día
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-md border border-border bg-card p-3">
      <Input
        value={values.title}
        onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
        placeholder="Título del día"
      />
      <Input
        value={values.city}
        onChange={(e) => setValues((v) => ({ ...v, city: e.target.value }))}
        placeholder="Ciudad (p. ej. Kioto)"
      />
      <Textarea
        value={values.summary}
        onChange={(e) => setValues((v) => ({ ...v, summary: e.target.value }))}
        placeholder="Resumen del día"
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={pending || !values.title.trim()}
          onClick={() =>
            start(async () => {
              await updateDayDetails(id, values);
              setOpen(false);
            })
          }
        >
          {pending ? "Guardando…" : "Guardar"}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>
          <X className="h-3.5 w-3.5" /> Cancelar
        </Button>
      </div>
    </div>
  );
}
