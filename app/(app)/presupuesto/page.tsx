import { getBudgetItems, isConfigured } from "@/lib/data";
import { BudgetRow } from "@/components/budget-row";
import { AddBudgetForm } from "@/components/add-budget-form";
import { SetupNotice } from "@/components/setup-notice";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatEUR } from "@/lib/utils";

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

  const items = await getBudgetItems();
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
          Para dos personas · 15 días · octubre
        </p>
      </div>

      <Card className="bg-gradient-to-br from-stone-50 to-muted">
        <CardContent className="space-y-3 pt-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Previsto</p>
              <p className="text-base font-bold">{formatEUR(planned)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Real anotado</p>
              <p className="text-base font-bold">{formatEUR(actualAll)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pagado</p>
              <p className="text-base font-bold text-success">{formatEUR(paid)}</p>
            </div>
          </div>
          <Progress value={pct} barClassName="bg-success" />
          <p className="text-center text-xs text-muted-foreground">
            {Math.round(pct)}% del presupuesto ya pagado
          </p>
        </CardContent>
      </Card>

      <AddBudgetForm />

      <div className="space-y-2">
        {items.map((item) => (
          <BudgetRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
