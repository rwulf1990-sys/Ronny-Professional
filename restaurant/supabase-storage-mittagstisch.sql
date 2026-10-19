-- ============================================================
-- DIS Restaurant – Speicherbereich für die Mittagskarte (PDF)
--
-- Legt in Supabase Storage einen öffentlich lesbaren Bereich an,
-- in den nur angemeldetes Personal (dieselbe Anmeldung wie fürs
-- Bestell-Dashboard) eine neue Mittagskarte hochladen darf. Löst
-- die Abhängigkeit von Google Drive ab, die wöchentlich zu alten
-- Karten geführt hat.
--
-- Einmalig im Supabase "SQL Editor" ausführen.
-- ============================================================

-- Bucket anlegen (öffentlich lesbar, damit die Website die PDF
-- ohne Login anzeigen kann).
insert into storage.buckets (id, name, public)
values ('mittagstisch', 'mittagstisch', true)
on conflict (id) do nothing;

-- Jeder darf die aktuelle Karte lesen (die Website selbst, ohne Login).
drop policy if exists "mittagstisch_public_read" on storage.objects;
create policy "mittagstisch_public_read" on storage.objects
  for select to public
  using (bucket_id = 'mittagstisch');

-- Nur angemeldetes Personal darf eine neue Karte hochladen/ersetzen.
drop policy if exists "mittagstisch_staff_upload" on storage.objects;
create policy "mittagstisch_staff_upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'mittagstisch');

drop policy if exists "mittagstisch_staff_update" on storage.objects;
create policy "mittagstisch_staff_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'mittagstisch')
  with check (bucket_id = 'mittagstisch');
