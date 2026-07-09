-- =====================================================================
--  Viaje a Japón — Tipo de cambio Yen/Euro (conversor + presupuesto en yenes).
--  Ejecutar DESPUÉS de 0001_schema.sql (y los demás scripts ya aplicados).
--  Idempotente: se puede ejecutar varias veces sin duplicar datos.
-- =====================================================================

alter table public.trip_settings
  add column if not exists yen_rate numeric(10, 4) not null default 165.00;

alter table public.trip_settings
  add column if not exists yen_rate_updated_at timestamptz;
