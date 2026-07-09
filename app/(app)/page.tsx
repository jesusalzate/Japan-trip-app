import Link from "next/link";
import { CalendarClock, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import {
  getBudgetItems,
  getTasks,
  getTripSettings,
  isConfigured,
} from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SetupNotice } from "@/components/setup-notice";
import { TripStartEditor } from "@/components/trip-start-editor";
import { CurrencyConverter } from "@/components/currency-converter";
import { TASK_CATEGORIES, dayDate, daysUntil, formatLong, formatShort } from "@/lib/trip";
import { eurToJpy } from "@/lib/currency";
import { formatEUR, formatJPY, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InicioPage() {
  if (!isConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Inicio</h1>
        <SetupNotice />
      </div>
    );
  }

  const [settings, tasks, budget] = await Promise.all([
    getTripSettings(),
    getTasks(),
    getBudgetItems(),
  ]);

  const start = dayDate(settings.start_date, 1);
  const countdown = daysUntil(start);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.is_done).length;
  const taskPct = totalTasks ? (doneTasks / totalTasks) * 100 : 0;

  const today = new Date();
  const upcoming = tasks
    .filter((t) => !t.is_done && t.due_date)
    .sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1))
    .slice(0, 4);
  const overdue = tasks.filter(
    (t) => !t.is_done && t.due_date && daysUntil(new Date(t.due_date), today) < 0,
  ).length;

  const plannedTotal = budget.reduce((s, b) => s + Number(b.planned_amount), 0);
  const paidTotal = budget
    .filter((b) => b.is_paid)
    .reduce((s, b) => s + Number(b.actual_amount ?? b.planned_amount), 0);
  const budgetPct = plannedTotal ? (paidTotal / plannedTotal) * 100 : 0;

  return (
    <div className="space-y-5">
      {/* Cuenta atrás */}
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary to-rose-700 text-white">
        <CardContent className="pt-5">
          <p className="text-sm/none opacity-80">Faltan</p>
          <p className="mt-1 text-5xl font-extrabold tracking-tight">
            {countdown > 0 ? countdown : countdown === 0 ? "¡Hoy!" : "—"}
            {countdown > 0 && (
              <span className="ml-2 text-xl font-semibold opacity-90">días</span>
            )}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm capitalize opacity-90">
            <CalendarClock className="h-4 w-4" />
            Salida: {formatLong(start)}
          </p>
          <TripStartEditor id={settings.id} startDate={settings.start_date} />
        </CardContent>
      </Card>

      {/* Conversor de moneda */}
      <CurrencyConverter
        settingsId={settings.id}
        rate={settings.yen_rate}
        updatedAt={settings.yen_rate_updated_at}
      />

      {/* Progreso de tareas */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Preparativos</CardTitle>
          <Link
            href="/tareas"
            className="flex items-center gap-1 text-xs font-medium text-primary"
          >
            Ver tareas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {doneTasks} de {totalTasks} completadas
            </span>
            <span className="font-semibold">{Math.round(taskPct)}%</span>
          </div>
          <Progress value={taskPct} barClassName="bg-success" />
          {overdue > 0 && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-danger">
              <AlertTriangle className="h-3.5 w-3.5" />
              {overdue} {overdue === 1 ? "tarea vencida" : "tareas vencidas"}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Próximos plazos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos plazos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {upcoming.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No quedan plazos pendientes. 🎉
            </p>
          )}
          {upcoming.map((t) => {
            const d = new Date(t.due_date!);
            const left = daysUntil(d, today);
            const meta = TASK_CATEGORIES[t.category];
            return (
              <div key={t.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{formatShort(d)}</p>
                </div>
                <Badge
                  className={cn(
                    "shrink-0",
                    left < 0
                      ? "bg-rose-100 text-rose-800"
                      : left <= 14
                        ? "bg-amber-100 text-amber-800"
                        : meta.color,
                  )}
                >
                  {left < 0
                    ? "Vencida"
                    : left === 0
                      ? "Hoy"
                      : `En ${left} d`}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Presupuesto */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Presupuesto</CardTitle>
          <Link
            href="/presupuesto"
            className="flex items-center gap-1 text-xs font-medium text-primary"
          >
            Detalle <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pagado</p>
              <p className="text-lg font-bold text-success">
                {formatEUR(paidTotal)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                ≈ {formatJPY(eurToJpy(paidTotal, settings.yen_rate))}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Presupuesto total</p>
              <p className="text-lg font-bold">{formatEUR(plannedTotal)}</p>
              <p className="text-[11px] text-muted-foreground">
                ≈ {formatJPY(eurToJpy(plannedTotal, settings.yen_rate))}
              </p>
            </div>
          </div>
          <Progress value={budgetPct} />
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            Para dos personas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
