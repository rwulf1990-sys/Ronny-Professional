# Wettbewerb: Lila Sektor

Stand: 12.10.2026. Grundlage sind nur öffentliche Suchergebnisse. Die Seiten selbst (TikTok, Instagram, Apple Podcasts, Rephonic) konnte ich aus der Arbeitsumgebung nicht direkt öffnen. Follower-Zahlen und Bewertungen stammen deshalb aus Suchergebnis-Auszügen und sollten auf den Profilen gegengeprüft werden. Die Rohdaten stehen in `competitors.csv`.

## 1. Wer schon da ist (sortiert nach Nähe)

| Name | Typ | Kanal | Was sie machen | Kennzahl |
| --- | --- | --- | --- | --- |
| [STINT – Der Formel 1 Podcast](https://www.podbean.com/itunes/1256090716) | direkt | Podcast, [YouTube](https://www.youtube.com/@stintf1podcast), Instagram | Rennanalyse sonntags direkt nach dem Rennen; nennt sich „schnellster F1-Podcast in D/A/CH“ | 4,8 Sterne bei 2.735 Bewertungen ([Rephonic](https://rephonic.com/podcasts/stint-der-formel-1-podcast)) |
| [ams.f1 / Formel Schmidt](https://www.auto-motor-und-sport.de/formel-1/neuer-youtube-f1-kanal/) | direkt | YouTube + Podcast | Analyse nach jedem Rennen mit Fachjournalisten, dazu ein Vorschauformat | nicht gefunden |
| [RaceDay](https://www.podcast.de/podcast/3644981/raceday-der-formel-1-podcast) | direkt | Podcast | GP-Besprechung, nennt Strategie ausdrücklich | nicht gefunden |
| [Starting Grid](https://podcasts.apple.com/de/podcast/starting-grid/id1058868792) | direkt | Podcast | wöchentlicher F1-Talk; laut [Rephonic](https://rephonic.com/podcasts/starting-grid-meinsportpodcastde) „beliebtester F1-Podcast in Deutschland“ | nicht gefunden |
| [F1nish First](https://www.podengine.ai/podcasts/f1nish-first-der-formel-1-podcast) | direkt | Podcast (zweiwöchentlich) | Rückblick und Prognosen; jüngste Folgen in den Ergebnissen von 2024 | nicht gefunden |
| [Sky Sport Formel 1](https://www.tiktok.com/@skysportformel1) | indirekt | TikTok | Clips, Interviews, Highlights des Rechteinhabers | 191,2 Tsd. Follower, 10,7 Mio. Likes (Suchergebnis) |
| [@formel1_de](https://www.tiktok.com/@formel1_de) | indirekt | TikTok | aktuelle F1-Clips auf Deutsch | nicht gefunden |
| [AvD-Motorsport-Magazin mit Christian Danner](https://www.auto.de/magazin/auto-medienportal-avd-motorsport-magazin-mit-christian-danner/) | indirekt | YouTube | rund 25-minütige Wochenendanalysen mit Ex-F1-Fahrer (Stand 2024) | nicht gefunden |
| [Chain Bear](https://www.netinfluencer.com/f1-youtube-channels/) | Ersatz | YouTube, englisch | Regeln, Technik, Reifen verständlich erklärt | rund 534 Tsd. Abonnenten |
| [Driver61](https://driver61.com/media) | Ersatz | YouTube, englisch | Technik und Fahrtechnik von einem Ex-Rennfahrer | über 10 Mio. Aufrufe pro Monat (Selbstangabe) |
| [FastF1 / Daten selbst auswerten](https://github.com/JanikSchala/f1-data-analysis) | Ersatz | Open Source | Fans werten Timing, Telemetrie und Reifenstints selbst aus | – |

Weitere Ersatzlösungen ohne eigene Zeile: die TV-Übertragung selbst und die Textanalysen von F1-Nachrichtenseiten.

**Was auffällt:** Für die Suche „deutschsprachiger F1-*Analyse*-Account auf TikTok/Instagram“ habe ich keinen einzigen eindeutigen Creator gefunden. Die Treffer waren Sender (Sky), offizielle Accounts oder Podcasts. Das ist ein Hinweis, aber **kein Beweis**: Suchmaschinen erfassen TikTok und Instagram schlecht. Vor dem Start musst du direkt in der TikTok- und Instagram-Suche nach „F1 Analyse“, „F1 Strategie“, „Reifenstrategie“ und „#formel1“ suchen und die zehn größten deutschsprachigen Accounts notieren.

## 2. Preise

Alle Konkurrenten sind für Fans **kostenlos**: Podcasts, YouTube und TikTok finanzieren sich über Werbung und Sponsoren. STINT hat zum Beispiel einen eSIM-Anbieter mit Rabattcode als Sponsor. Eine bezahlte Mitgliedschaft (Patreon, Steady o. Ä.) habe ich bei keinem gefunden.

- Niedrigster Preis: 0 €, Median: 0 €, höchster Preis: 0 €.
- Bezahlt wird nur für die Rennen selbst: Sky hat bis Ende 2027 die Exklusivrechte, RTL hat Sky 2026 übernommen, und nur wenige Rennen laufen im Free-TV ([auto motor und sport](https://www.auto-motor-und-sport.de/formel-1/2026-rennen-live-tv-sender-streams/), [TV Movie](https://www.tvmovie.de/news/formel-1-wieder-gratis-bei-rtl-das-aendert-sich-mit-der-sky-uebernahme-158934)).

Für `/founder-pricing` heißt das: Eine Mitgliedschaft hat keinen direkten Vergleichspreis im deutschsprachigen Markt. Ihr Wert muss vom Panel und von einer echten Warteliste kommen.

## 3. Positionierungskarte

Achse X: **Format**, von lang (Podcast, 25+ Minuten) bis kurz (Kurzvideo unter 90 Sekunden).
Achse Y: **Tiefe**, von News und Clips bis Daten- und Strategieanalyse.

```
                 TIEFE: Daten/Strategie
                          |
  Formel Schmidt  RaceDay |
  STINT  AvD/Danner       |      [ LÜCKE? ]  <- Lila Sektor
  Chain Bear (EN)         |      Driver61-Kurzclips (EN)
  ------------------------+------------------------------
  LANG                    |                         KURZ
  Starting Grid           |
                          |   Sky Sport F1 (TikTok)
                          |   @formel1_de
                 TIEFE: News/Clips
```

Lange deutsche Formate liefern Analyse. Kurze deutsche Formate liefern Clips und News. Das Feld „kurz **und** datenbasiert, auf Deutsch“ war in den Suchergebnissen leer.

## 4. Was Fans kritisieren (Beschwerden)

Die Belege sind **dünn**: Jedes Thema stützt sich auf weniger als drei auffindbare Bewertungen.

1. **Zu wenig Tiefe bei Technik, Finanzen und Strategie** (1 Bewertung, dünn). Bei Starting Grid wünscht sich ein Hörer mehr technische, finanzielle und strategische Tiefe ([Apple Podcasts](https://podcasts.apple.com/de/podcast/starting-grid/id1058868792)). Den genauen Wortlaut konnte ich nicht zitieren, weil die Seite nicht erreichbar war.
2. **„Früher besser…“** (1 Bewertungstitel, dünn). Ebenfalls Starting Grid; der Text ist im Auszug abgeschnitten.
3. **Lautstärke** (1 Bewertung, dünn). Ein STINT-Hörer wünscht sich eine lautere Abmischung ([Apple Podcasts](https://podcasts.apple.com/de/podcast/stint-der-formel-1-podcast/id1256090716)).
4. **Nationale Färbung bei Sky** (Branchenkritik, keine Fan-Bewertungen). Adrian Newey warf Sky F1 (UK) eine zu nationalistische Berichterstattung vor ([auto motor und sport](https://www.auto-motor-und-sport.de/formel-1/adrian-newey-kritik-sky-f1-tv-verstappen-vettel/)). Red Bull und Aston Martin haben Sky-Interviews boykottiert. Das betrifft den Rechteinhaber, nicht die Creator.

Für ein belastbares Bild fehlen Kommentare unter den TikTok- und Instagram-Videos der großen Accounts sowie Reddit-Threads (r/formel1). Beides konnte ich nicht abrufen.

## 5. Die Lücke

**Kurze, datenbasierte Strategie-Erklärungen auf Deutsch, jeweils eine Entscheidung pro Video, mit Grafik und Quelle.** Das passt zur Board-Empfehlung („ein Strategie-Fall pro Rennen“) und stützt sich auf drei Beobachtungen:

- Die deutschen Analyse-Angebote sind lang (Podcasts, 25-Minuten-Videos). Die deutschen Kurzformate sind Clips ohne Analyse.
- Die Daten dafür sind frei verfügbar. Mit FastF1 lassen sich Reifenstints und Pace auswerten, wie das [GitHub-Projekt](https://github.com/JanikSchala/f1-data-analysis) zeigt. Laut einem [Wett-Ratgeber](https://formel1wettentipps-de.com/artikel/formel-1-wettstrategie/) gibt es international Community-Analysten, die genau solche Long-Run- und Strategiegrafiken posten. Auf Deutsch habe ich das nicht gefunden.
- Zumindest ein Hörer vermisst bei einem großen Podcast die strategische Tiefe. Das ist nur ein dünner Beleg.

**Ehrliche Einschränkung:** Die Lücke ist nur so gut wie die Suche. Wenn deine eigene Suche auf TikTok und Instagram einen deutschen Account findet, der das schon gut macht, gibt es diese Lücke nicht. Prüf das, bevor du das erste Video produzierst.

**Eine zweite Lücke:** Bei keinem deutschen Angebot habe ich eine bezahlte Mitgliedschaft gefunden. Das kann eine Chance sein, aber auch ein Zeichen, dass deutsche F1-Fans für Analyse nicht zahlen. `/founder-consumer` soll genau das prüfen.

## 6. Die Gefahr: Wer kann dich am schnellsten kopieren?

1. **STINT.** Das Team ist schnell (Folge am Sonntagabend), hat schon eine Hörerschaft, einen YouTube-Kanal und Instagram. Kurzclips aus dem Podcast zu schneiden kostet sie fast nichts.
2. **ams.f1 / Formel Schmidt.** Das sind Fachjournalisten mit Fahrerlager-Zugang und Verlagsreichweite. Wenn sie ihre Analysen als Kurzvideos zuschneiden, haben sie Glaubwürdigkeit, die du nicht hast.
3. **Sky/RTL.** Sie haben die Bewegtbildrechte und große TikTok-Reichweite. Eine Strategie-Grafik-Serie wäre für sie ein kleines Projekt.

**Was davor schützt:** Rennbilder (Bewegtbild) darfst du ohnehin nicht nutzen, die Rechte liegen bei der F1 bzw. Sky. Deine Videos müssen deshalb aus eigenen Grafiken und Daten bestehen. Genau dieses Grafik-Format kann zu deinem Wiedererkennungsmerkmal werden („Lila Sektor“ in Lila). Ein echter Schutz ist das nicht. Schützen kann dich nur Tempo, eine feste Form und eine eigene Kontaktliste (Newsletter).
