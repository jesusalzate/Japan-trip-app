"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { addTask } from "@/app/actions";
import { TASK_CATEGORIES } from "@/lib/trip";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { TaskCategory } from "@/lib/types";

export function AddTaskForm() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Añadir tarea
      </Button>
    );
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <form
          ref={formRef}
          action={async (fd) => {
            await addTask(fd);
            formRef.current?.reset();
            setOpen(false);
          }}
          className="space-y-3"
        >
          <Input name="title" placeholder="¿Qué hay que hacer?" required autoFocus />
          <Input name="description" placeholder="Detalle (opcional)" />
          <div className="grid grid-cols-2 gap-3">
            <Select name="category" defaultValue="otros">
              {(Object.keys(TASK_CATEGORIES) as TaskCategory[]).map((c) => (
                <option key={c} value={c}>
                  {TASK_CATEGORIES[c].label}
                </option>
              ))}
            </Select>
            <Input name="due_date" type="date" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Guardar
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
