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

-- Hinweis: Dieses Skript ist für ein NEUES Projekt gedacht. Läuft
-- hier schon ein Projekt mit den alten, offenen "anon_*"-Policies,
-- stattdessen restaurant/supabase-harden-rls.sql ausführen (räumt
-- die alten Policies sauber ab, statt sie doppelt anzulegen).

-- Kunden (anonym, ohne eigenen Account) dürfen Bestellungen
-- aufgeben - aber nur mit plausiblen Werten (Status 'neu', Betrag
-- nicht negativ, Abholzeit/Telefon nicht überlang). Gespeichert
-- wird nur die Telefonnummer zur Rückfrage – keine Zahlungsdaten.
create policy "insert_orders" on public.orders
  for insert to anon, authenticated with check (
    status = 'neu'
    and total >= 0
    and char_length(coalesce(pickup, '')) <= 100
    and char_length(coalesce(phone, '')) <= 40
  );

-- Lesen, Status ändern und abgeholte Bestellungen löschen nur für
-- angemeldetes Personal (Supabase-Login übers Dashboard-Passwort,
-- Account unter "Authentication" → "Users" anlegen - E-Mail wie in
-- restaurant/supabase-config.js unter "staffEmail").
create policy "staff_select" on public.orders
  for select to authenticated using (true);
create policy "staff_update" on public.orders
  for update to authenticated using (true) with check (true);
create policy "staff_delete" on public.orders
  for delete to authenticated using (true);
