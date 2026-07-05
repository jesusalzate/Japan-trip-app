-- =====================================================================
--  Viaje a Japón — Corrige "UPDATE requires a WHERE clause".
--
--  Este proyecto de Supabase tiene activada una protección que bloquea
--  cualquier UPDATE/DELETE sin cláusula WHERE (para evitar modificar una
--  tabla entera por accidente). Las funciones de 0003_itinerary_day_management.sql
--  tenían una línea que actualiza sort_order en todas las filas a propósito,
--  sin WHERE, y esa protección la bloqueaba. Aquí se añade "where true"
--  (una condición siempre verdadera) para cumplir el requisito sin cambiar
--  el comportamiento.
--
--  Ejecutar DESPUÉS de 0003_itinerary_day_management.sql.
--  Reemplaza (CREATE OR REPLACE) las mismas dos funciones; es seguro
--  ejecutarlo varias veces.
-- =====================================================================

create or replace function public.insert_itinerary_day(
  p_after_day_number int,
  p_title text default 'Nuevo día',
  p_city text default null,
  p_summary text default null
) returns public.itinerary_days
language plpgsql
as $$
declare
  v_new_day public.itinerary_days;
begin
  if p_after_day_number < 0 then
    raise exception 'p_after_day_number no puede ser negativo';
  end if;

  update public.itinerary_days set day_number = -day_number where day_number > p_after_day_number;
  update public.itinerary_days set day_number = -day_number + 1 where day_number < 0;

  insert into public.itinerary_days (day_number, title, city, summary, sort_order)
  values (p_after_day_number + 1, coalesce(nullif(trim(p_title), ''), 'Nuevo día'), p_city, p_summary, p_after_day_number + 1)
  returning * into v_new_day;

  update public.itinerary_days set sort_order = day_number where true;

  return v_new_day;
end;
$$;

create or replace function public.delete_itinerary_day(p_day_number int)
returns void
language plpgsql
as $$
begin
  delete from public.itinerary_days where day_number = p_day_number;

  update public.itinerary_days set day_number = -day_number where day_number > p_day_number;
  update public.itinerary_days set day_number = -day_number - 1 where day_number < 0;

  update public.itinerary_days set sort_order = day_number where true;
end;
$$;

grant execute on function public.insert_itinerary_day(int, text, text, text) to authenticated;
grant execute on function public.delete_itinerary_day(int) to authenticated;
revoke execute on function public.insert_itinerary_day(int, text, text, text) from public, anon;
revoke execute on function public.delete_itinerary_day(int) from public, anon;
