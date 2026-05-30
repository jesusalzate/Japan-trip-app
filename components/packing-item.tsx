"use client";

import { useTransition } from "react";
import { Check, Trash2 } from "lucide-react";
import { togglePacking, deletePackingItem } from "@/app/actions";
import { cn } from "@/lib/utils";
import type { PackingItem } from "@/lib/types";

export function PackingRow({ item }: { item: PackingItem }) {
  const [pending, start] = useTransition();
  return (
    <div className={cn("flex items-center gap-3 py-2.5", pending && "opacity-60")}>
      <button
        onClick={() => start(() => togglePacking(item.id, !item.is_packed))}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2",
          item.is_packed
            ? "border-success bg-success text-white"
            : "border-border hover:border-success",
        )}
        aria-label="Marcar"
      >
        {item.is_packed && <Check className="h-3 w-3" strokeWidth={3} />}
      </button>
      <span
        className={cn(
          "flex-1 text-sm",
          item.is_packed && "text-muted-foreground line-through",
        )}
      >
        {item.label}
      </span>
      {item.assigned_to && item.assigned_to !== "ambos" && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {item.assigned_to}
        </span>
      )}
      <button
        onClick={() => start(() => deletePackingItem(item.id))}
        className="text-muted-foreground hover:text-danger"
        aria-label="Eliminar"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
