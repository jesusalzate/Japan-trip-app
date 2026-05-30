"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { addBudgetItem } from "@/app/actions";
import { BUDGET_CATEGORIES } from "@/lib/trip";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { BudgetCategory } from "@/lib/types";

export function AddBudgetForm() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Añadir gasto
      </Button>
    );
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <form
          ref={formRef}
          action={async (fd) => {
            await addBudgetItem(fd);
            formRef.current?.reset();
            setOpen(false);
          }}
          className="space-y-3"
        >
          <Input name="label" placeholder="Concepto" required autoFocus />
          <div className="grid grid-cols-2 gap-3">
            <Select name="category" defaultValue="tickets">
              {(Object.keys(BUDGET_CATEGORIES) as BudgetCategory[]).map((c) => (
                <option key={c} value={c}>
                  {BUDGET_CATEGORIES[c]}
                </option>
              ))}
            </Select>
            <Input
              name="planned_amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="€ previsto"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Guardar
            </Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
