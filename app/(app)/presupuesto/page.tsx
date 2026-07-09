import { getBudgetItems, getTripSettings, isConfigured } from "@/lib/data";
import { BudgetRow } from "@/components/budget-row";
import { AddBudgetForm } from "@/components/add-budget-form";
import { SetupNotice } from "@/components/setup-notice";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { eurToJpy } from "@/lib/currency";
import { formatEUR, formatJPY } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PresupuestoPage() {
  if (!isConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Presupuesto</h1>
        <SetupNotice />
      </div>
    );
  }

  const [items, settings] = await Promise.all([
    getBudgetItems(),
    getTripSettings(),
  ]);
  const rate = settings.yen_rate;

  const planned = items.reduce((s, b) => s + Number(b.planned_amount), 0);
  const paid = items
    .filter((b) => b.is_paid)
    .reduce((s, b) => s + Number(b.actual_amount ?? b.planned_amount), 0);
  const actualAll = items.reduce(
    (s, b) => s + Number(b.actual_amount ?? 0),
    0,
  );
  const pct = planned ? (paid / planned) * 100 : 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Presupuesto</h1>
        <p className="text-sm text-muted-foreground">
          Para dos personas · octubre
        </p>
      </div>

      <Card className="bg-gradient-to-br from-stone-50 to-muted">
        <CardContent className="space-y-3 pt-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Previsto</p>
              <p className="text-base font-bold">{formatEUR(planned)}</p>
              <p className="text-[11px] text-muted-foreground">
                ≈ {formatJPY(eurToJpy(planned, rate))}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Real anotado</p>
              <p className="text-base font-bold">{formatEUR(actualAll)}</p>
              <p className="text-[11px] text-muted-foreground">
                ≈ {formatJPY(eurToJpy(actualAll, rate))}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pagado</p>
              <p className="text-base font-bold text-success">{formatEUR(paid)}</p>
              <p className="text-[11px] text-muted-foreground">
                ≈ {formatJPY(eurToJpy(paid, rate))}
              </p>
            </div>
          </div>
          <Progress value={pct} barClassName="bg-success" />
          <p className="text-center text-xs text-muted-foreground">
            {Math.round(pct)}% del presupuesto ya pagado · 1 € ={" "}
            {rate.toLocaleString("es-ES", { maximumFractionDigits: 2 })} ¥
          </p>
        </CardContent>
      </Card>

      <AddBudgetForm />

      <div className="space-y-2">
        {items.map((item) => (
          <BudgetRow key={item.id} item={item} rate={rate} />
        ))}
      </div>
    </div>
  );
}
