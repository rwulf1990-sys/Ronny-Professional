-- ============================================================
-- DIS Restaurant – Nachrichtenfeld für Bestellungen
--
-- Ergänzt die orders-Tabelle um ein optionales Textfeld, in dem
-- Kunden beim Bestellen eine kurze Nachricht hinterlassen können
-- (z.B. Allergien, Sonderwünsche). Erscheint im Dashboard und im
-- Neue-Bestellung-Pop-up.
--
-- WICHTIG: Dieses Skript VOR dem Website-Update ausführen, sonst
-- schlagen neue Bestellungen fehl (die Website würde ein Feld
-- mitschicken, das die Datenbank noch nicht kennt).
--
-- Einmalig im Supabase "SQL Editor" ausführen.
-- ============================================================

alter table public.orders add column if not exists note text;

-- Insert-Regel aktualisieren: Nachricht darf nicht beliebig lang sein
-- (verhindert, dass über die offene Bestell-API riesige Textmengen
-- eingeschleust werden).
drop policy if exists "insert_orders" on public.orders;
create policy "insert_orders" on public.orders
  for insert to anon, authenticated with check (
    status = 'neu'
    and total >= 0
    and char_length(coalesce(pickup, '')) <= 100
    and char_length(coalesce(phone, '')) <= 40
    and char_length(coalesce(note, '')) <= 500
  );
