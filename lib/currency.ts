// Conversión Euro <-> Yen usando la tasa guardada en trip_settings.yen_rate
// (cuántos yenes vale 1 euro). El importe en yenes nunca se guarda: siempre
// se calcula al vuelo a partir del euro y la tasa actual.

/** Tasa por defecto (yenes por euro) si aún no se ha configurado ninguna. */
export const DEFAULT_YEN_RATE = 165;

export function eurToJpy(eur: number, rate: number): number {
  if (!Number.isFinite(eur) || !Number.isFinite(rate)) return 0;
  return eur * rate;
}

export function jpyToEur(jpy: number, rate: number): number {
  if (!Number.isFinite(jpy) || !Number.isFinite(rate) || rate <= 0) return 0;
  return jpy / rate;
}
