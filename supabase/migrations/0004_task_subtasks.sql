-- =====================================================================
--  Viaje a Japón — Subtareas (checklist) dentro de cada tarea.
--  Ejecutar DESPUÉS de 0001_schema.sql (y los demás scripts ya aplicados).
--  Idempotente: se puede ejecutar varias veces sin duplicar datos.
-- =====================================================================

create table if not exists public.task_subtasks (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references public.tasks(id) on delete cascade,
  title      text not null,
  is_done    boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.task_subtasks enable row level security;

drop policy if exists "couple_all_access" on public.task_subtasks;
create policy "couple_all_access" on public.task_subtasks
  for all to authenticated using (true) with check (true);

grant select, insert, update, delete on public.task_subtasks to authenticated;

do $$
begin
  begin
    alter publication supabase_realtime add table public.task_subtasks;
  exception when duplicate_object then null;
  end;
end $$;
