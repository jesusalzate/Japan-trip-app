import { NextResponse } from "next/server";

/**
 * Tipo de cambio EUR -> JPY desde un servicio público sin clave (Frankfurter,
 * datos de referencia del BCE). Solo se llama al pulsar "Actualizar" en el
 * conversor; el resultado se guarda en trip_settings para que lo vean los dos.
 */
export async function GET() {
  try {
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=EUR&to=JPY",
      { cache: "no-store" },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `El servicio de cambio respondió con un error (${res.status}).` },
        { status: 502 },
      );
    }

    const data = await res.json();
    const rate = data?.rates?.JPY;

    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
      return NextResponse.json(
        { error: "Respuesta inesperada del servicio de cambio." },
        { status: 502 },
      );
    }

    return NextResponse.json({ rate, date: data.date ?? null });
  } catch {
    return NextResponse.json(
      { error: "No se pudo contactar con el servicio de cambio." },
      { status: 502 },
    );
  }
}
