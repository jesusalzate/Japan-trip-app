-- =====================================================================
--  Viaje a Japón — Esquema de base de datos
--  Datos COMPARTIDOS entre las dos personas (no se filtran por usuario).
--  RLS: cualquier usuario autenticado tiene acceso total. Como el registro
--  público está desactivado y solo existen 2 cuentas, "authenticated" = la pareja.
-- =====================================================================

create extension if not exists moddatetime schema extensions;

-- ----------------------------- Tablas --------------------------------

create table if not exists public.trip_settings (
  id           uuid primary key default gen_random_uuid(),
  trip_name    text not null default 'Viaje a Japón',
  start_date   date not null default '2026-10-01',
  total_budget numeric(10,2) not null default 5770.42,
  currency     text not null default 'EUR',
  updated_at   timestamptz not null default now()
);

create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  category    text not null default 'otros',
  due_date    date,
  is_done     boolean not null default false,
  done_at     timestamptz,
  sort_order  int not null default 0,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.itinerary_days (
  id         uuid primary key default gen_random_uuid(),
  day_number int not null unique,
  title      text not null,
  city       text,
  summary    text,
  notes      text,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.itinerary_activities (
  id         uuid primary key default gen_random_uuid(),
  day_id     uuid not null references public.itinerary_days(id) on delete cascade,
  name       text not null,
  time_label text,
  location   text,
  notes      text,
  is_done    boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.budget_items (
  id             uuid primary key default gen_random_uuid(),
  category       text not null,
  label          text not null,
  planned_amount numeric(10,2) not null default 0,
  actual_amount  numeric(10,2),
  is_paid        boolean not null default false,
  notes          text,
  sort_order     int not null default 0,
  updated_at     timestamptz not null default now()
);

create table if not exists public.packing_items (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  label       text not null,
  is_packed   boolean not null default false,
  assigned_to text default 'ambos',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.documents (
  id              uuid primary key default gen_random_uuid(),
  category        text not null,
  title           text not null,
  storage_path    text not null,
  mime_type       text,
  size_bytes      bigint,
  related_task_id uuid references public.tasks(id) on delete set null,
  uploaded_by     uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now()
);

-- -------------------- Triggers updated_at ----------------------------

create or replace trigger trg_trip_settings_updated before update on public.trip_settings
  for each row execute function extensions.moddatetime(updated_at);
create or replace trigger trg_tasks_updated before update on public.tasks
  for each row execute function extensions.moddatetime(updated_at);
create or replace trigger trg_days_updated before update on public.itinerary_days
  for each row execute function extensions.moddatetime(updated_at);
create or replace trigger trg_budget_updated before update on public.budget_items
  for each row execute function extensions.moddatetime(updated_at);

-- -------------------- Privilegios de los roles API -------------------
-- La autorización fina la hacen las políticas RLS de abajo; estos GRANT solo
-- dan acceso a nivel de tabla al rol "authenticated" (la pareja autenticada).
-- "anon" no recibe privilegios: sin sesión no se accede a los datos del viaje.

grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- ----------------------------- RLS -----------------------------------

alter table public.trip_settings        enable row level security;
alter table public.tasks                 enable row level security;
alter table public.itinerary_days        enable row level security;
alter table public.itinerary_activities  enable row level security;
alter table public.budget_items          enable row level security;
alter table public.packing_items         enable row level security;
alter table public.documents             enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'trip_settings','tasks','itinerary_days','itinerary_activities',
    'budget_items','packing_items','documents'
  ]
  loop
    execute format('drop policy if exists "couple_all_access" on public.%I;', t);
    execute format(
      'create policy "couple_all_access" on public.%I for all to authenticated using (true) with check (true);',
      t
    );
  end loop;
end $$;

-- ----------------------- Realtime (sync en vivo) ---------------------

do $$
declare t text;
begin
  foreach t in array array[
    'trip_settings','tasks','itinerary_days','itinerary_activities',
    'budget_items','packing_items','documents'
  ]
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I;', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;

-- --------------------- Storage: documentos privados ------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents', 'documents', false, 10485760,
  array['application/pdf','image/png','image/jpeg','image/webp','image/heic']
)
on conflict (id) do nothing;

drop policy if exists "couple_docs_select" on storage.objects;
drop policy if exists "couple_docs_insert" on storage.objects;
drop policy if exists "couple_docs_update" on storage.objects;
drop policy if exists "couple_docs_delete" on storage.objects;

create policy "couple_docs_select" on storage.objects
  for select to authenticated using (bucket_id = 'documents');
create policy "couple_docs_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'documents');
create policy "couple_docs_update" on storage.objects
  for update to authenticated using (bucket_id = 'documents');
create policy "couple_docs_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'documents');
