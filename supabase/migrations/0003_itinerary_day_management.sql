-- =====================================================================
--  Viaje a Japón — Añadir y eliminar días del itinerario.
--  Ejecutar DESPUÉS de 0001_schema.sql, 0002_itinerary_transport.sql y seed.sql.
--
--  Los días se numeran de forma secuencial (1..N) sin huecos, porque la
--  fecha de cada día se calcula como start_date + (day_number - 1). Estas
--  funciones insertan/eliminan un día y renumeran el resto según haga falta,
--  evitando el conflicto de la restricción UNIQUE(day_number) al pasar
--  primero por valores negativos (que nunca chocan con los positivos).
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

  -- Abre hueco: desplaza +1 todos los días posteriores al punto de inserción.
  update public.itinerary_days set day_number = -day_number where day_number > p_after_day_number;
  update public.itinerary_days set day_number = -day_number + 1 where day_number < 0;

  insert into public.itinerary_days (day_number, title, city, summary, sort_order)
  values (p_after_day_number + 1, coalesce(nullif(trim(p_title), ''), 'Nuevo día'), p_city, p_summary, p_after_day_number + 1)
  returning * into v_new_day;

  update public.itinerary_days set sort_order = day_number;

  return v_new_day;
end;
$$;

create or replace function public.delete_itinerary_day(p_day_number int)
returns void
language plpgsql
as $$
begin
  delete from public.itinerary_days where day_number = p_day_number;

  -- Cierra el hueco: desplaza -1 todos los días posteriores.
  update public.itinerary_days set day_number = -day_number where day_number > p_day_number;
  update public.itinerary_days set day_number = -day_number - 1 where day_number < 0;

  update public.itinerary_days set sort_order = day_number;
end;
$$;

grant execute on function public.insert_itinerary_day(int, text, text, text) to authenticated;
grant execute on function public.delete_itinerary_day(int) to authenticated;
revoke execute on function public.insert_itinerary_day(int, text, text, text) from public, anon;
revoke execute on function public.delete_itinerary_day(int) from public, anon;
