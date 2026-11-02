-- ============================================================
-- DIS Restaurant – Telegram-Benachrichtigung bei neuer Bestellung
--
-- Schickt bei jeder neuen Bestellung automatisch eine Telegram-
-- Nachricht ans Handy - unabhängig davon, ob das Dashboard offen
-- ist, der Ton an ist oder der Browser-Tab im Hintergrund läuft.
-- Läuft direkt in der Datenbank (Trigger), nicht im Browser.
--
-- Die Nachricht enthält dieselben Infos wie das Dashboard:
-- Bestell-Nr., Datum/Uhrzeit, jedes Gericht mit allen Details
-- (Extras/Anpassungen), Abholzeit, Telefonnummer, Kundennachricht
-- und Gesamtbetrag.
--
-- Einmalige Einrichtung vorher (ca. 3 Minuten):
-- 1. In Telegram den Bot "@BotFather" öffnen, "/newbot" senden,
--    einen Namen vergeben -> man bekommt einen BOT-TOKEN
--    (Format: "123456789:AAE...").
-- 2. Dem neuen Bot einmal eine beliebige Nachricht schreiben
--    (z.B. "Hallo"), damit er "weiß", wer ihr seid.
-- 3. Die eigene CHAT-ID herausfinden: Bot "@userinfobot" öffnen,
--    "/start" senden -> er zeigt eure Id (eine Zahl, z.B. 123456789).
--    Für eine Telegram-GRUPPE (mehrere Mitarbeiter): den Bot zur
--    Gruppe hinzufügen, dann im Browser
--    https://api.telegram.org/bot<BOT-TOKEN>/getUpdates öffnen und
--    die "chat":{"id": ...} der Gruppe ablesen (negative Zahl).
-- 4. Unten BOT_TOKEN und CHAT_ID durch die eigenen Werte ersetzen.
-- 5. Dieses Skript einmalig im Supabase "SQL Editor" ausführen.
--
-- Test: Im Dashboard auf "Demo-Bestellung" klicken - danach sollte
-- innerhalb weniger Sekunden eine Telegram-Nachricht ankommen.
--
-- Passwort/Token später ändern: dieses Skript einfach mit neuem
-- Wert erneut ausführen (ersetzt die Funktion automatisch).
-- ============================================================

-- pg_net wird für den HTTP-Aufruf aus der Datenbank heraus benötigt
-- (bei Supabase standardmäßig verfügbar, zur Sicherheit hier aktiviert).
create extension if not exists pg_net with schema extensions;

create or replace function public.notify_telegram_new_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  bot_token text := 'DEIN-BOT-TOKEN-HIER';
  chat_id   text := 'DEINE-CHAT-ID-HIER';
  items_txt text;
  msg       text;
begin
  -- Jedes bestellte Gericht mit seinen Details (Extras/Anpassungen),
  -- genauso wie es im Dashboard pro Bestellung aufgelistet wird.
  select string_agg(
           '• ' || coalesce(entry.item->>'dish', '–')
           || case
                when jsonb_typeof(entry.item->'details') = 'array'
                     and jsonb_array_length(entry.item->'details') > 0
                then chr(10) || '   ' || (
                       select string_agg(d, ', ')
                       from jsonb_array_elements_text(entry.item->'details') as d
                     )
                else ''
              end,
           chr(10)
           order by entry.ord
         )
    into items_txt
    from jsonb_array_elements(coalesce(new.items, '[]'::jsonb)) with ordinality as entry(item, ord);

  msg := '🔔 Neue Bestellung – DIS Restaurant' || chr(10)
      || '🧾 #' || upper(right(new.id::text, 4))
      || ' · ' || to_char(new.created_at, 'DD.MM.YYYY, HH24:MI') || ' Uhr'
      || chr(10) || chr(10)
      || coalesce(items_txt, '–')
      || chr(10) || chr(10)
      || coalesce('🕛 Abholung: ' || nullif(trim(new.pickup), '') || chr(10), '')
      || coalesce('📞 Telefon: ' || nullif(trim(new.phone), '') || chr(10), '')
      || coalesce('💬 Hinweis: ' || nullif(trim(new.note), '') || chr(10), '')
      || chr(10)
      || '💰 Gesamt: ' || to_char(new.total, 'FM999990.00') || ' €';

  perform net.http_post(
    url  := 'https://api.telegram.org/bot' || bot_token || '/sendMessage',
    body := jsonb_build_object('chat_id', chat_id, 'text', msg)
  );

  return new;
end;
$$;

drop trigger if exists trg_notify_telegram_new_order on public.orders;
create trigger trg_notify_telegram_new_order
  after insert on public.orders
  for each row
  execute function public.notify_telegram_new_order();
