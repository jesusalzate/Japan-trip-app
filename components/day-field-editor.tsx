"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** Editor de un campo de texto libre de un día (notas, transporte, ...). */
export function DayFieldEditor({
  id,
  initial,
  placeholder,
  saveLabel,
  action,
}: {
  id: string;
  initial: string | null;
  placeholder: string;
  saveLabel: string;
  action: (id: string, value: string) => Promise<void>;
}) {
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
        placeholder={placeholder}
      />
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          disabled={!dirty || pending}
          onClick={() =>
            start(async () => {
              await action(id, value);
              setSaved(true);
            })
          }
        >
          {pending ? "Guardando…" : saveLabel}
        </Button>
        {saved && !dirty && (
          <span className="text-xs text-success">Guardado ✓</span>
        )}
      </div>
    </div>
  );
}
