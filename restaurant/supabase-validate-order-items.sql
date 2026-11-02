-- ============================================================
-- DIS Restaurant – Bestellungen gegen Preis-Manipulation sichern
--
-- Bisher wurde beim Aufgeben einer Bestellung nur geprüft, dass der
-- Gesamtbetrag nicht negativ ist - NICHT, ob er überhaupt zu den
-- bestellten Gerichten passt. Der öffentliche Seitencode (normal
-- und gewollt öffentlich) erlaubt es aber jedem, auch direkt per
-- API-Aufruf - am Bestellformular vorbei - eine Bestellung
-- einzureichen. Ohne diese Prüfung hätte man dabei teure Gerichte
-- auflisten, aber einen beliebig niedrigen Gesamtbetrag angeben
-- können.
--
-- Ab jetzt prüft die Datenbank bei jeder neuen Bestellung:
-- 1. Der Gesamtbetrag muss (bis auf eine winzige Rundungstoleranz)
--    exakt der Summe der einzelnen Positionspreise entsprechen.
-- 2. Jeder Einzelpreis liegt in einem plausiblen Rahmen (0 - 50 €).
-- 3. Die Bestellung enthält zwischen 1 und 100 Positionen, jede mit
--    einem vernünftig kurzen Namen/Details (schützt nebenbei auch
--    vor überlangen Telegram-Nachrichten).
--
-- Bricht KEINE bestehende Funktion: echte Bestellungen von der
-- Website erfüllen diese Regeln automatisch, weil die Website den
-- Gesamtbetrag genauso berechnet (Summe der Einzelpreise im
-- Warenkorb).
--
-- Wichtige Einschränkung: Diese Prüfung verhindert, dass der
-- GESAMTBETRAG verändert wird, ohne zu den aufgelisteten Positionen
-- zu passen. Sie prüft NICHT, ob der Preis eines einzelnen Gerichts
-- exakt der echten Speisekarte entspricht - das würde eine zweite,
-- in der Datenbank gepflegte Preisliste erfordern, die bei jeder
-- Preisänderung von Hand mitgepflegt werden müsste. Das hier deckt
-- den naheliegendsten und leichtesten Manipulationsweg ab. Für
-- lückenlosen Schutz (exakte Preisprüfung pro Gericht) gerne
-- Bescheid sagen, das wäre ein größerer Zusatzschritt.
--
-- Einmalig im Supabase "SQL Editor" ausführen.
-- ============================================================

create or replace function public.validate_order_before_insert()
returns trigger
language plpgsql
as $$
declare
  item_count int;
  items_sum  numeric;
  item       jsonb;
begin
  if jsonb_typeof(coalesce(new.items, 'null'::jsonb)) is distinct from 'array' then
    raise exception 'items muss ein Array sein';
  end if;

  item_count := jsonb_array_length(new.items);
  if item_count < 1 or item_count > 100 then
    raise exception 'Bestellung muss zwischen 1 und 100 Positionen enthalten';
  end if;

  items_sum := 0;
  for item in select * from jsonb_array_elements(new.items)
  loop
    if jsonb_typeof(item->'dish') is distinct from 'string'
       or char_length(item->>'dish') < 1
       or char_length(item->>'dish') > 100 then
      raise exception 'Ungültiger Gerichtname in Bestellung';
    end if;

    if item->'details' is not null then
      if jsonb_typeof(item->'details') is distinct from 'array' then
        raise exception 'Ungültiges Details-Feld in Bestellung';
      end if;
      if jsonb_array_length(item->'details') > 10 then
        raise exception 'Zu viele Detail-Einträge in einer Position';
      end if;
      if exists (
        select 1 from jsonb_array_elements_text(item->'details') as d
        where length(d) > 100
      ) then
        raise exception 'Zu langer Detail-Eintrag in einer Position';
      end if;
    end if;

    if jsonb_typeof(item->'price') is distinct from 'number'
       or (item->>'price')::numeric <= 0
       or (item->>'price')::numeric > 50 then
      raise exception 'Ungültiger Einzelpreis in Bestellung';
    end if;

    items_sum := items_sum + (item->>'price')::numeric;
  end loop;

  if abs(new.total - items_sum) > 0.01 then
    raise exception 'Gesamtbetrag passt nicht zur Summe der Positionen';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_order_before_insert on public.orders;
create trigger trg_validate_order_before_insert
  before insert on public.orders
  for each row
  execute function public.validate_order_before_insert();
