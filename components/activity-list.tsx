"use client";

import { useRef, useState, useTransition } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { toggleActivity, deleteActivity, addActivity } from "@/app/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ItineraryActivity } from "@/lib/types";

function ActivityRow({ activity }: { activity: ItineraryActivity }) {
  const [pending, start] = useTransition();
  return (
    <div
      className={cn(
        "flex items-start gap-3 py-2.5",
        pending && "opacity-60",
      )}
    >
      <button
        onClick={() => start(() => toggleActivity(activity.id, !activity.is_done))}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
          activity.is_done
            ? "border-success bg-success text-white"
            : "border-border hover:border-success",
        )}
        aria-label="Marcar actividad"
      >
        {activity.is_done && <Check className="h-3 w-3" strokeWidth={3} />}
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium leading-snug",
            activity.is_done && "text-muted-foreground line-through",
          )}
        >
          {activity.name}
        </p>
        {(activity.time_label || activity.location) && (
          <p className="text-xs text-muted-foreground">
            {[activity.time_label, activity.location].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
      <button
        onClick={() => start(() => deleteActivity(activity.id))}
        className="mt-0.5 text-muted-foreground hover:text-danger"
        aria-label="Eliminar actividad"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ActivityList({
  dayId,
  activities,
}: {
  dayId: string;
  activities: ItineraryActivity[];
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      <div className="divide-y divide-border">
        {activities.map((a) => (
          <ActivityRow key={a.id} activity={a} />
        ))}
        {activities.length === 0 && (
          <p className="py-2 text-sm text-muted-foreground">
            Sin actividades todavía.
          </p>
        )}
      </div>

      {open ? (
        <form
          ref={formRef}
          action={async (fd) => {
            await addActivity(dayId, fd);
            formRef.current?.reset();
            setOpen(false);
          }}
          className="mt-3 space-y-2"
        >
          <Input name="name" placeholder="Actividad (p. ej. Shibuya Sky)" required autoFocus />
          <Input name="time_label" placeholder="Mañana / Tarde / Noche (opcional)" />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="flex-1">
              Añadir
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" /> Añadir actividad
        </Button>
      )}
    </div>
  );
}
