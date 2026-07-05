-- =====================================================================
--  Viaje a Japón — Añade el transporte de cada día del itinerario.
--  Ejecutar DESPUÉS de 0001_schema.sql y seed.sql.
--  Idempotente: se puede ejecutar varias veces sin duplicar datos.
-- =====================================================================

alter table public.itinerary_days add column if not exists transport text;

-- Rellena el transporte recomendado por día (solo si aún no tiene uno,
-- para no pisar ediciones manuales ya guardadas desde la app).
update public.itinerary_days as d
set transport = v.transport
from (values
  (1,  'Billete aéreo internacional (Madrid–Tokio).'),
  (2,  'Tren expreso al centro (N''EX / Monorraíl).'),
  (3,  'Metro de Tokio (pase de 72 horas).'),
  (4,  'Metro de Tokio (pase de 72 horas).'),
  (5,  'Metro de Tokio + tren Yurikamome (a Toyosu).'),
  (6,  'Tren Odakyu Romancecar (a Hakone).'),
  (7,  'Tren bala Tokaido Shinkansen (a Kioto).'),
  (8,  'Autobús y líneas locales de Kioto.'),
  (9,  'Autobús y líneas locales de Kioto.'),
  (10, 'Tren local JR (pase Kansai-Hiroshima).'),
  (11, 'Tren local JR (pase Kansai-Hiroshima).'),
  (12, 'Shinkansen y ferry JR (pase regional).'),
  (13, 'Tren local JR (pase Kansai-Hiroshima).'),
  (14, 'Tren bala Tokaido Shinkansen (a Tokio).'),
  (15, 'Tren expreso al aeropuerto / billete aéreo.')
) as v(day_number, transport)
where d.day_number = v.day_number
  and d.transport is null;
