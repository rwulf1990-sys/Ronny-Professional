-- ============================================================
-- DIS Restaurant – Bestell-Tabelle
-- Einmalig im Supabase "SQL Editor" ausführen.
-- ============================================================

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  items jsonb not null,
  total numeric not null,
  pickup text,
  phone text,
  status text not null default 'neu'
);

-- Falls die Tabelle schon existiert: Telefon-Spalte nachrüsten.
alter table public.orders add column if not exists phone text;

alter table public.orders enable row level security;

-- Kunden (anonym) dürfen Bestellungen aufgeben; das Dashboard
-- (ebenfalls anonym, kein Login) darf lesen, Status ändern und
-- abgeholte Bestellungen löschen. Gespeichert wird nur die
-- Telefonnummer zur Rückfrage – keine Zahlungsdaten.
create policy "anon_insert" on public.orders
  for insert to anon with check (true);
create policy "anon_select" on public.orders
  for select to anon using (true);
create policy "anon_update" on public.orders
  for update to anon using (true) with check (true);
create policy "anon_delete" on public.orders
  for delete to anon using (true);
