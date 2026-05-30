import { getTasks, isConfigured } from "@/lib/data";
import { TaskItem } from "@/components/task-item";
import { AddTaskForm } from "@/components/add-task-form";
import { SetupNotice } from "@/components/setup-notice";
import { Progress } from "@/components/ui/progress";

export const dynamic = "force-dynamic";

export default async function TareasPage() {
  if (!isConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Tareas</h1>
        <SetupNotice />
      </div>
    );
  }

  const tasks = await getTasks();
  const pending = tasks.filter((t) => !t.is_done);
  const done = tasks.filter((t) => t.is_done);
  const pct = tasks.length ? (done.length / tasks.length) * 100 : 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Tareas</h1>
        <p className="text-sm text-muted-foreground">
          Preparativos antes del viaje, con sus fechas límite.
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {done.length}/{tasks.length} completadas
          </span>
          <span className="font-semibold">{Math.round(pct)}%</span>
        </div>
        <Progress value={pct} barClassName="bg-success" />
      </div>

      <AddTaskForm />

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Pendientes ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
            ¡Todo hecho! 🎉
          </p>
        ) : (
          pending.map((t) => <TaskItem key={t.id} task={t} />)
        )}
      </section>

      {done.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Completadas ({done.length})
          </h2>
          {done.map((t) => (
            <TaskItem key={t.id} task={t} />
          ))}
        </section>
      )}
    </div>
  );
}
