"use client";

import { useRef, useState, useTransition } from "react";
import { Check, Trash2 } from "lucide-react";
import { addSubtask, deleteSubtask, toggleSubtask } from "@/app/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TaskSubtask } from "@/lib/types";

function SubtaskRow({ subtask }: { subtask: TaskSubtask }) {
  const [pending, start] = useTransition();
  return (
    <div className={cn("flex items-center gap-2 py-1", pending && "opacity-60")}>
      <button
        onClick={() => start(() => toggleSubtask(subtask.id, !subtask.is_done))}
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2",
          subtask.is_done
            ? "border-success bg-success text-white"
            : "border-border hover:border-success",
        )}
        aria-label="Marcar subtarea"
      >
        {subtask.is_done && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
      </button>
      <span
        className={cn(
          "flex-1 text-xs",
          subtask.is_done && "text-muted-foreground line-through",
        )}
      >
        {subtask.title}
      </span>
      <button
        onClick={() => start(() => deleteSubtask(subtask.id))}
        className="text-muted-foreground hover:text-danger"
        aria-label="Eliminar subtarea"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function SubtaskList({
  taskId,
  subtasks,
}: {
  taskId: string;
  subtasks: TaskSubtask[];
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="mt-1.5 space-y-0.5">
      {subtasks.map((s) => (
        <SubtaskRow key={s.id} subtask={s} />
      ))}

      {open ? (
        <form
          ref={formRef}
          action={async (fd) => {
            await addSubtask(taskId, fd);
            formRef.current?.reset();
          }}
          className="flex gap-1.5 pt-1"
        >
          <Input
            name="title"
            placeholder="Nueva subtarea"
            className="h-8 text-xs"
            autoFocus
            required
          />
          <Button type="submit" size="sm">
            Añadir
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Listo
          </Button>
        </form>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="pt-1 text-xs text-muted-foreground hover:text-primary"
        >
          + Añadir subtarea
        </button>
      )}
    </div>
  );
}
