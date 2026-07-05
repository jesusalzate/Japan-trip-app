"use client";

import { useState, useTransition } from "react";
import { Check, ChevronDown, Pencil, Trash2, X } from "lucide-react";
import { toggleTask, deleteTask, updateTaskDetails } from "@/app/actions";
import { TASK_CATEGORIES, daysUntil, formatShort } from "@/lib/trip";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { SubtaskList } from "@/components/subtask-list";
import type { Task, TaskCategory, TaskSubtask } from "@/lib/types";

export function TaskItem({
  task,
  subtasks,
}: {
  task: Task;
  subtasks: TaskSubtask[];
}) {
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [values, setValues] = useState({
    title: task.title,
    description: task.description ?? "",
    category: task.category,
    due_date: task.due_date ?? "",
  });

  if (editing) {
    return (
      <div className="space-y-2 rounded-md border border-border bg-card p-3">
        <Input
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          placeholder="¿Qué hay que hacer?"
          autoFocus
        />
        <Textarea
          value={values.description}
          onChange={(e) =>
            setValues((v) => ({ ...v, description: e.target.value }))
          }
          placeholder="Detalle (opcional)"
        />
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={values.category}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                category: e.target.value as TaskCategory,
              }))
            }
          >
            {(Object.keys(TASK_CATEGORIES) as TaskCategory[]).map((c) => (
              <option key={c} value={c}>
                {TASK_CATEGORIES[c].label}
              </option>
            ))}
          </Select>
          <Input
            type="date"
            value={values.due_date}
            onChange={(e) =>
              setValues((v) => ({ ...v, due_date: e.target.value }))
            }
          />
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            disabled={pending || !values.title.trim()}
            onClick={() =>
              start(async () => {
                await updateTaskDetails(task.id, values);
                setEditing(false);
              })
            }
          >
            {pending ? "Guardando…" : "Guardar"}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setEditing(false)}
          >
            <X className="h-3.5 w-3.5" /> Cancelar
          </Button>
        </div>
      </div>
    );
  }

  const meta = TASK_CATEGORIES[task.category];
  const due = task.due_date ? new Date(task.due_date) : null;
  const left = due ? daysUntil(due) : null;
  const overdue = !task.is_done && left !== null && left < 0;
  const doneSubtasks = subtasks.filter((s) => s.is_done).length;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border border-border bg-card p-3 transition-opacity",
        pending && "opacity-60",
      )}
    >
      <button
        onClick={() => start(() => toggleTask(task.id, !task.is_done))}
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          task.is_done
            ? "border-success bg-success text-white"
            : "border-border hover:border-success",
        )}
        aria-label={task.is_done ? "Marcar como pendiente" : "Marcar como hecha"}
      >
        {task.is_done && <Check className="h-4 w-4" strokeWidth={3} />}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium leading-snug",
            task.is_done && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{task.description}</p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <Badge className={meta.color}>{meta.label}</Badge>
          {due && (
            <span
              className={cn(
                "text-xs",
                overdue ? "font-semibold text-danger" : "text-muted-foreground",
              )}
            >
              {formatShort(due)}
              {overdue && " · vencida"}
              {!task.is_done && left !== null && left >= 0 && left <= 14 && (
                <span className="text-warning"> · en {left} d</span>
              )}
            </span>
          )}
        </div>

        <div className="mt-1.5 border-t border-border pt-1.5">
          <button
            onClick={() => setShowSubtasks((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                !showSubtasks && "-rotate-90",
              )}
            />
            Subtareas
            {subtasks.length > 0 && ` · ${doneSubtasks}/${subtasks.length}`}
          </button>
          {showSubtasks && (
            <SubtaskList taskId={task.id} subtasks={subtasks} />
          )}
        </div>
      </div>

      <div className="mt-0.5 flex shrink-0 items-center gap-2.5">
        <button
          onClick={() => setEditing(true)}
          className="text-muted-foreground hover:text-primary"
          aria-label="Editar tarea"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => start(() => deleteTask(task.id))}
          className="text-muted-foreground hover:text-danger"
          aria-label="Eliminar tarea"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
