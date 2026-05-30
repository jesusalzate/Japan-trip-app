"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { updateBudgetActual, deleteBudgetItem } from "@/app/actions";
import { BUDGET_CATEGORIES } from "@/lib/trip";
import { formatEUR, cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { BudgetItem } from "@/lib/types";

export function BudgetRow({ item }: { item: BudgetItem }) {
  const [pending, start] = useTransition();
  const [actual, setActual] = useState(
    item.actual_amount != null ? String(item.actual_amount) : "",
  );

  function save(nextPaid: boolean) {
    const num = actual.trim() === "" ? null : Number(actual);
    start(() => updateBudgetActual(item.id, num, nextPaid));
  }

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-card p-3",
        pending && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium">{item.label}</p>
          <p className="text-xs text-muted-foreground">
            {BUDGET_CATEGORIES[item.category]} · previsto{" "}
            {formatEUR(item.planned_amount)}
          </p>
        </div>
        <button
          onClick={() => start(() => deleteBudgetItem(item.id))}
          className="text-muted-foreground hover:text-danger"
          aria-label="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            €
          </span>
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            value={actual}
            placeholder="Real"
            className="h-9 pl-7 text-sm"
            onChange={(e) => setActual(e.target.value)}
            onBlur={() => save(item.is_paid)}
          />
        </div>
        <label className="flex h-9 cursor-pointer select-none items-center gap-1.5 rounded-md border border-border px-3 text-sm">
          <input
            type="checkbox"
            checked={item.is_paid}
            onChange={(e) => save(e.target.checked)}
            className="h-4 w-4 accent-[var(--success)]"
          />
          Pagado
        </label>
      </div>
    </div>
  );
}
