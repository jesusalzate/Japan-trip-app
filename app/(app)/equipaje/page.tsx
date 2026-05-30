import { Info } from "lucide-react";
import { getPackingItems, isConfigured } from "@/lib/data";
import { PackingRow } from "@/components/packing-item";
import { AddPackingForm } from "@/components/add-packing-form";
import { SetupNotice } from "@/components/setup-notice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PACKING_CATEGORIES } from "@/lib/trip";
import type { PackingCategory, PackingItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const ORDER: PackingCategory[] = [
  "documentos_visado",
  "equipaje",
  "electronica",
  "salud",
];

export default async function EquipajePage() {
  if (!isConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Equipaje y documentos</h1>
        <SetupNotice />
      </div>
    );
  }

  const items = await getPackingItems();
  const byCat = (c: PackingCategory): PackingItem[] =>
    items.filter((i) => i.category === c);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Equipaje y documentos</h1>
        <p className="text-sm text-muted-foreground">
          Documentos para el visado y lista de la maleta.
        </p>
      </div>

      <Card className="border-amber-300 bg-amber-50">
        <CardContent className="flex gap-2 pt-4 text-xs text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <strong>Visado (nacionalidad colombiana, residentes en España):</strong>{" "}
            trámite obligatorio y <strong>gratuito</strong>, en formato físico
            (pegatina). Jurisdicción del <strong>Consulado de Japón en Barcelona</strong>{" "}
            (Cataluña, C. Valenciana y Baleares). Cita por correo:{" "}
            <span className="font-mono">visado@bc.mofa.go.jp</span>. El pasaporte se
            recoge <strong>en persona</strong>. No se aceptan declaración de renta/RUT
            ni tarjetas de crédito como solvencia.
          </p>
        </CardContent>
      </Card>

      {ORDER.map((cat) => {
        const list = byCat(cat);
        const done = list.filter((i) => i.is_packed).length;
        return (
          <Card key={cat}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{PACKING_CATEGORIES[cat]}</CardTitle>
              <span className="text-xs text-muted-foreground">
                {done}/{list.length}
              </span>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-border">
                {list.map((item) => (
                  <PackingRow key={item.id} item={item} />
                ))}
                {list.length === 0 && (
                  <p className="py-2 text-sm text-muted-foreground">
                    Sin elementos.
                  </p>
                )}
              </div>
              <AddPackingForm category={cat} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
