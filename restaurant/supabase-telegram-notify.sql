-- ============================================================
-- DIS Restaurant – Telegram-Benachrichtigung bei neuer Bestellung
--
-- Schickt bei jeder neuen Bestellung automatisch eine Telegram-
-- Nachricht ans Handy - unabhängig davon, ob das Dashboard offen
-- ist, der Ton an ist oder der Browser-Tab im Hintergrund läuft.
-- Läuft direkt in der Datenbank (Trigger), nicht im Browser.
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
  dishes    text;
  msg       text;
begin
  select string_agg(coalesce(item->>'dish', '–'), ', ')
    into dishes
    from jsonb_array_elements(coalesce(new.items, '[]'::jsonb)) as item;

  msg := '🔔 Neue Bestellung – DIS Restaurant' || chr(10)
      || coalesce(dishes, '–') || chr(10)
      || 'Abholung: ' || coalesce(new.pickup, '–') || chr(10)
      || 'Betrag: ' || to_char(new.total, 'FM999990.00') || ' €';

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
