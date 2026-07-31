#!/usr/bin/env bash
# ============================================================
# Baut aus dem Repo das fertige IONOS-Paket (Restaurant als
# Startseite) in den Ordner ./build.
#   - Restaurant-Dateien ins Wurzelverzeichnis
#   - Pfade angepasst (../fonts -> fonts, ../vendor -> ./vendor)
#   - Dis-Branding-Preview-Badge entfernt
#   - .htaccess (richtige MIME-Typen) hinzugefügt
# Wird vom GitHub-Workflow .github/workflows/deploy-ionos.yml
# aufgerufen.
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
B="$ROOT/build"

rm -rf "$B"
mkdir -p "$B/fonts" "$B/vendor"

# --- Restaurant-Dateien -> Wurzel ---
cp "$ROOT/restaurant/index.html"         "$B/index.html"
cp "$ROOT/restaurant/app.js"             "$B/app.js"
cp "$ROOT/restaurant/style.css"          "$B/style.css"
cp "$ROOT/restaurant/supabase-config.js" "$B/supabase-config.js"
cp "$ROOT/restaurant/email-config.js"    "$B/email-config.js"
cp "$ROOT/restaurant/dashboard.html"     "$B/dashboard.html"
cp "$ROOT/restaurant/mittagstisch.html"  "$B/mittagstisch.html"
cp "$ROOT/restaurant/impressum.html"     "$B/impressum.html"
cp "$ROOT/restaurant/datenschutz.html"   "$B/datenschutz.html"

# --- Nur die tatsächlich genutzten Schriften (Montserrat) ---
cp "$ROOT/fonts/montserrat-latin-400-normal.woff2" "$B/fonts/"
cp "$ROOT/fonts/montserrat-latin-500-normal.woff2" "$B/fonts/"
cp "$ROOT/fonts/montserrat-latin-700-normal.woff2" "$B/fonts/"

# --- 3D-Bibliothek ---
cp "$ROOT/vendor/three.module.min.js" "$B/vendor/"

# --- Pfade anpassen ---
sed -i 's#\.\./fonts/#fonts/#g'   "$B/index.html" "$B/dashboard.html" "$B/mittagstisch.html" "$B/impressum.html" "$B/datenschutz.html" "$B/style.css"
sed -i "s#from '\.\./vendor/three.module.min.js'#from './vendor/three.module.min.js'#" "$B/app.js"

# --- "Dis Branding"-Preview-Badge entfernen (auf der echten Domain unpassend) ---
sed -i '/class="preview-badge"/d' "$B/index.html"

# --- Titel/Meta säubern ---
sed -i 's# · 3D Preview##g; s# · 3D-Preview##g' "$B/index.html"

# --- .htaccess: korrekte MIME-Typen für ES-Module & Schriften ---
cat > "$B/.htaccess" <<'HT'
# DIS Restaurant – Server-Konfiguration für IONOS
DirectoryIndex index.html

<IfModule mod_mime.c>
  AddType application/javascript .js
  AddType application/javascript .mjs
  AddType text/css             .css
  AddType font/woff2           .woff2
  AddType image/svg+xml        .svg
  AddType application/json     .json
</IfModule>

AddDefaultCharset UTF-8

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>
HT

echo "Build fertig in $B:"
ls -R "$B"
