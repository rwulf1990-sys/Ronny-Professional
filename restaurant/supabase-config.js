/* ============================================================
   Supabase-Konfiguration für echte, geräteübergreifende
   Bestellungen.

   Einrichtung (einmalig, ca. 5 Minuten):
   1. Kostenloses Projekt anlegen: https://supabase.com
   2. Im Projekt: "SQL Editor" öffnen und das Setup-SQL aus
      restaurant/supabase-setup.sql ausführen
   3. Unter "Project Settings" → "API" die beiden Werte kopieren
      und hier unten eintragen:
      - Project URL  → url
      - anon public  → anonKey
   4. Unter "Authentication" → "Users" → "Add user" einen Account
      für das Dashboard anlegen (E-Mail wie unten bei staffEmail,
      Passwort = das Dashboard-Passwort). Das Passwort wird NICHT
      mehr hier im Code gespeichert, sondern nur noch in Supabase -
      zum Ändern dort den Nutzer bearbeiten.

   Solange url/anonKey leer sind, läuft die Seite im lokalen
   Demo-Modus (Bestellungen nur auf demselben Gerät sichtbar).
   ============================================================ */

window.DIS_SUPABASE = {
  url: 'https://cjcysqefchfnyryrdsbo.supabase.co',
  anonKey: 'sb_publishable_S7sshUv_5VIUcdXow1Zakw_fDUaaYx9',
  staffEmail: 'dashboard@dis-restaurant.de',
};
