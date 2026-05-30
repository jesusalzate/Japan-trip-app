import { Card, CardContent } from "@/components/ui/card";

/** Aviso que se muestra mientras Supabase no esté configurado. */
export function SetupNotice() {
  return (
    <Card className="border-amber-300 bg-amber-50">
      <CardContent className="space-y-2 pt-4 text-sm text-amber-900">
        <p className="font-semibold">⚙️ Falta configurar Supabase</p>
        <p>
          La app está lista, pero todavía no está conectada a la base de datos.
          Sigue los pasos del archivo <code>README.md</code> para crear el
          proyecto de Supabase, añadir las dos cuentas y cargar los datos del
          viaje.
        </p>
      </CardContent>
    </Card>
  );
}
