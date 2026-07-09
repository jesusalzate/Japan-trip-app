import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Cron diario (ver vercel.json) que refresca el tipo de cambio EUR->JPY
 * automáticamente, sin que nadie tenga que tocar el botón manual.
 *
 * No hay sesión de usuario en un cron job, así que:
 * - Se autoriza mediante el secreto compartido CRON_SECRET (Vercel lo añade
 *   solo a sus propias llamadas programadas si la variable existe).
 * - Se escribe con la clave service_role (solo en el servidor, nunca
 *   expuesta al navegador) porque RLS exige un usuario autenticado y aquí
 *   no lo hay.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Falta configurar SUPABASE_SERVICE_ROLE_KEY en Vercel." },
      { status: 500 },
    );
  }

  let rate: number;
  let date: string | null = null;
  try {
    const rateRes = await fetch(
      "https://api.frankfurter.app/latest?from=EUR&to=JPY",
      { cache: "no-store" },
    );
    if (!rateRes.ok) {
      return NextResponse.json(
        { error: `El servicio de cambio respondió con un error (${rateRes.status}).` },
        { status: 502 },
      );
    }
    const rateData = await rateRes.json();
    const fetched = rateData?.rates?.JPY;
    if (typeof fetched !== "number" || !Number.isFinite(fetched) || fetched <= 0) {
      return NextResponse.json(
        { error: "Respuesta inesperada del servicio de cambio." },
        { status: 502 },
      );
    }
    rate = fetched;
    date = rateData.date ?? null;
  } catch {
    return NextResponse.json(
      { error: "No se pudo contactar con el servicio de cambio." },
      { status: 502 },
    );
  }

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: settingsRow, error: fetchError } = await admin
    .from("trip_settings")
    .select("id")
    .limit(1)
    .single();

  if (fetchError || !settingsRow) {
    return NextResponse.json(
      { error: "No se encontró la fila de configuración del viaje (trip_settings)." },
      { status: 500 },
    );
  }

  const { error: updateError } = await admin
    .from("trip_settings")
    .update({ yen_rate: rate, yen_rate_updated_at: new Date().toISOString() })
    .eq("id", settingsRow.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, rate, date });
}
