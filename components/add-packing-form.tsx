"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { addPackingItem } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import type { PackingCategory } from "@/lib/types";

export function AddPackingForm({ category }: { category: PackingCategory }) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="mt-1 w-full"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" /> Añadir
      </Button>
    );
  }

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await addPackingItem(fd);
        formRef.current?.reset();
        setOpen(false);
      }}
      className="mt-2 space-y-2"
    >
      <input type="hidden" name="category" value={category} />
      <Input name="label" placeholder="Nuevo elemento" required autoFocus />
      <div className="flex gap-2">
        <Select name="assigned_to" defaultValue="ambos" className="h-9 text-sm">
          <option value="ambos">Ambos</option>
          <option value="él">Él</option>
          <option value="ella">Ella</option>
        </Select>
        <Button type="submit" size="sm">
          Añadir
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
