import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isConfigured } from "@/lib/data";
import { BottomNav } from "@/components/bottom-nav";
import { RealtimeRefresh } from "@/components/realtime-refresh";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configured = isConfigured();

  // Si Supabase ya está configurado, exigimos sesión (defensa en profundidad,
  // además del proxy). Si no, dejamos pasar para mostrar el aviso de configuración.
  if (configured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-xl">🗾</span>
          <span className="font-semibold">Viaje a Japón</span>
        </div>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </form>
      </header>

      <main className="flex-1 px-4 pb-24 pt-4">{children}</main>

      <BottomNav />
      {configured && <RealtimeRefresh />}
    </div>
  );
}
