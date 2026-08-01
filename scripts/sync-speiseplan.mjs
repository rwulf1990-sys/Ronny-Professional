#!/usr/bin/env node
// ============================================================
// Sucht im öffentlich freigegebenen Google-Drive-Ordner des
// Kunden nach der zuletzt geänderten PDF (= aktueller
// Speiseplan) und trägt deren Datei-ID in restaurant/app.js
// ein. Wird vom Workflow .github/workflows/sync-speiseplan.yml
// aufgerufen - der Kunde muss dafür nur noch die PDF in den
// Drive-Ordner hochladen, den Rest übernimmt die Action.
// ============================================================

import fs from 'node:fs';

const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
const appJsPath = new URL('../restaurant/app.js', import.meta.url);

function setOutput(name, value) {
  const file = process.env.GITHUB_OUTPUT;
  if (file) {
    fs.appendFileSync(file, `${name}=${value}\n`);
  }
}

if (!apiKey || !folderId) {
  console.log(
    '::warning::GOOGLE_DRIVE_API_KEY und/oder GOOGLE_DRIVE_FOLDER_ID sind ' +
    'noch nicht als Secrets hinterlegt - Sync wird übersprungen.'
  );
  process.exit(0);
}

const query = `'${folderId}' in parents and mimeType='application/pdf' and trashed=false`;
const url =
  'https://www.googleapis.com/drive/v3/files' +
  `?q=${encodeURIComponent(query)}` +
  '&orderBy=modifiedTime desc' +
  '&pageSize=5' +
  '&fields=files(id,name,modifiedTime)' +
  `&key=${apiKey}`;

const res = await fetch(url);
if (!res.ok) {
  const body = await res.text();
  console.error(`Drive-API-Fehler ${res.status}: ${body}`);
  console.error(
    'Prüfe, ob der Ordner auf "Jeder mit dem Link (Betrachter)" freigegeben ist ' +
    'und ob die Drive API für den API-Key aktiviert ist.'
  );
  process.exit(1);
}

const data = await res.json();
const files = data.files || [];

if (files.length === 0) {
  console.log('Keine PDF im Speiseplan-Ordner gefunden - nichts zu tun.');
  process.exit(0);
}

const newest = files[0];
console.log(`Aktuellste Datei im Ordner: "${newest.name}" (${newest.id}, geändert ${newest.modifiedTime})`);

const appJs = fs.readFileSync(appJsPath, 'utf8');
const pattern = /(MITTAGSTISCH_DRIVE_URL = 'https:\/\/drive\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)(\/preview')/;
const match = appJs.match(pattern);

if (!match) {
  console.error('MITTAGSTISCH_DRIVE_URL wurde in restaurant/app.js nicht gefunden.');
  process.exit(1);
}

const currentId = match[2];
if (currentId === newest.id) {
  console.log('Speiseplan ist bereits aktuell - keine Änderung nötig.');
  process.exit(0);
}

const updated = appJs.replace(pattern, `$1${newest.id}$3`);
fs.writeFileSync(appJsPath, updated);

console.log(`Speiseplan aktualisiert: ${currentId} -> ${newest.id}`);
setOutput('changed', 'true');
setOutput('filename', newest.name);
