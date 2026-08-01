# ◆ DIS BRANDING — Epische 3D-Website

Eine immersive One-Page-Website mit echtem WebGL-3D für das Projekt **Dis Branding**.

![Tech](https://img.shields.io/badge/Three.js-WebGL-8b5cf6) ![Stack](https://img.shields.io/badge/Stack-HTML%20%2B%20CSS%20%2B%20JS-22d3ee)

## ✨ Features

- **3D-Hero-Szene** (Three.js): facettierter Kristall mit leuchtendem Kern, Wireframe-Hülle, Orbit-Ringe, schwebende Shards und 1.600 Partikel
- **Maus-Parallax** — die Kamera folgt sanft der Mausbewegung
- **Scroll-Kamera** — beim Scrollen zieht die Kamera zurück und die Szene blendet cineastisch aus
- **Custom Cursor** mit magnetischem Ring
- **3D-Tilt-Cards** mit Spotlight-Glow (Leistungen & Showcase)
- **Scroll-Reveal-Animationen**, animierte Zähler, Marquee-Band
- **Loader-Animation** mit Diamant-Spin
- Komplett **self-contained**: Three.js und Fonts (Syne + Space Grotesk) liegen lokal — kein CDN nötig
- Responsiv inkl. Mobile-Menü, `prefers-reduced-motion` wird respektiert

## 🚀 Lokal starten

Kein Build-Schritt nötig — nur ein statischer Server (wegen ES-Modules):

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## 📁 Struktur

```
index.html          # Markup (One-Page, deutsch)
css/style.css       # Design-System, Animationen, Responsive
js/main.js          # Three.js-Szene + alle Interaktionen
vendor/             # three.module.min.js (v0.160.0)
fonts/              # Syne & Space Grotesk (woff2, lokal)
```

## 🎨 Farbwelt

| Rolle | Farbe |
|---|---|
| Hintergrund | `#05050f` |
| Violett | `#8b5cf6` |
| Cyan | `#22d3ee` |
| Magenta | `#ec4899` |

## 🍽️ Mittagstisch-Speiseplan (Auto-Sync)

Die Restaurant-Seite (`restaurant/`) zeigt den wöchentlichen Speiseplan als
Google-Drive-Vorschau (PDF) in einem Modal an. Der Workflow
`.github/workflows/sync-speiseplan.yml` prüft mehrmals täglich einen
freigegebenen Drive-Ordner und aktualisiert die verlinkte Datei-ID
automatisch, sobald der Kunde eine neue PDF hochlädt — inklusive
automatischem Deploy. Einrichtung siehe Kommentar am Anfang der
Workflow-Datei.
