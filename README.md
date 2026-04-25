# ZIPWIZE – drink smarter

Lokale Web-App / PWA als MVP für bewusstes Alkohol-Tracking.

## Stack

- Vite + React
- Tailwind CSS
- lokale Speicherung im Browser per localStorage
- PWA-Grundstruktur mit Manifest und Service Worker
- kein Backend, kein Login, keine Registrierung

## Projekt starten

### 1. Node.js installieren

Installiere Node.js LTS von https://nodejs.org.

### 2. Projektordner öffnen

Entpacke diese ZIP-Datei und öffne den Ordner `zipwize-mvp` in einem Terminal.

Windows-Beispiel:

```bash
cd Downloads/zipwize-mvp
```

macOS-Beispiel:

```bash
cd ~/Downloads/zipwize-mvp
```

### 3. Abhängigkeiten installieren

```bash
npm install
```

### 4. Lokal starten

```bash
npm run dev
```

Danach im Browser öffnen:

```text
http://localhost:5173
```

### 5. Produktionsversion bauen

```bash
npm run build
```

Die fertige statische App liegt danach im Ordner `dist`.

## Deployment auf Vercel

1. Projektordner zu GitHub hochladen.
2. Bei Vercel einloggen.
3. `Add New Project` klicken.
4. GitHub-Repository auswählen.
5. Framework: `Vite`.
6. Build Command: `npm run build`.
7. Output Directory: `dist`.
8. Deploy klicken.

## Deployment auf Netlify

1. Netlify öffnen.
2. Projektordner oder GitHub-Repository auswählen.
3. Build Command: `npm run build`.
4. Publish Directory: `dist`.
5. Deploy klicken.

## Wichtige MVP-Vereinfachungen

- Push-Notifications sind vorbereitet, aber Version 1 nutzt primär In-App-Erinnerungen.
- Die Alkoholwerte sind bewusst grobe Schätzungen und keine medizinischen Werte.
- Insights sind regelbasiert, keine echte KI.
- Alle Daten bleiben lokal auf dem Gerät.
