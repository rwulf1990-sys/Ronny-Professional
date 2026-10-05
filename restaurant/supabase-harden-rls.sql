-- ============================================================
-- DIS Restaurant – RLS verschärfen
--
-- Bisher durften mit dem öffentlichen anonKey (steht offen im
-- Seitencode, jeder Website-Besucher lädt ihn) ALLE Bestellungen
-- gelesen, geändert und gelöscht werden - inklusive Kunden-
-- Telefonnummern. Ab jetzt dürfen Kunden weiterhin ohne Login
-- Bestellungen aufgeben, aber nur noch angemeldetes Personal darf
-- Bestellungen einsehen, Status ändern oder löschen.
--
-- Voraussetzung (einmalig, vor diesem Skript):
-- Supabase-Projekt → "Authentication" → "Users" → "Add user" →
-- einen Nutzer anlegen mit der E-Mail, die in
-- restaurant/supabase-config.js unter "staffEmail" steht
-- (Standard: dashboard@dis-restaurant.de), Passwort = das
-- bisherige Dashboard-Passwort (oder ein neues).
--
-- Danach dieses Skript einmalig im Supabase "SQL Editor"
-- ausführen.
-- ============================================================

-- Alte, uneingeschränkt offene Policies entfernen
drop policy if exists "anon_insert" on public.orders;
drop policy if exists "anon_select" on public.orders;
drop policy if exists "anon_update" on public.orders;
drop policy if exists "anon_delete" on public.orders;

-- Bestellungen aufgeben: weiterhin ohne Login möglich (Kunden
-- haben keinen Account), aber nur mit plausiblen Werten - Status
-- muss 'neu' sein, Betrag darf nicht negativ sein, Abholzeit/
-- Telefonnummer dürfen keine überlangen Werte enthalten. Das
-- verhindert manipulierte/eingeschleuste Inhalte schon auf
-- Datenbankebene.
create policy "insert_orders" on public.orders
  for insert to anon, authenticated with check (
    status = 'neu'
    and total >= 0
    and char_length(coalesce(pickup, '')) <= 100
    and char_length(coalesce(phone, '')) <= 40
  );

-- Lesen, Status ändern, abgeholte Bestellungen löschen: nur noch
-- für angemeldetes Personal (echte Supabase-Anmeldung über das
-- Dashboard-Passwort, nicht mehr über den öffentlichen Schlüssel).
create policy "staff_select" on public.orders
  for select to authenticated using (true);
create policy "staff_update" on public.orders
  for update to authenticated using (true) with check (true);
create policy "staff_delete" on public.orders
  for delete to authenticated using (true);
