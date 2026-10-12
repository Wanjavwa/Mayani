# Heritage Preservation Intelligence Platform

A working prototype for archaeological heritage managers: digital twin, material inventory, environmental risk, degradation scenarios, and conservation planning.

The visual language is archival — parchment, walnut, brass — not a generic SaaS dashboard.

## Current heritage site

The active site in this app is the currently loaded public heritage model for the twin viewer. The simulation logic is intentionally labeled as illustrative and is not presented as a verified record of a named monument.

The app uses transparent metadata, scenario assumptions, and risk labels so that evidence-based observations can replace the current illustrative values later.

Reserved connections (not ingested yet):

- [CyArk](https://www.cyark.org/) — 3D heritage documentation
- [Zamani Project](https://zamaniproject.org/) — African heritage spatial documentation
- [MAEASaM](https://maeasam.org/) — site records and threats
- [Copernicus Climate Change Service](https://climate.copernicus.eu/) — climate observations and projections
- [NASA Earthdata](https://www.earthdata.nasa.gov/) — environmental and remote-sensing data

## Run the frontend

```bash
npm install
npm run dev
```

Open http://localhost:5173

Dependencies: React, Vite, TypeScript, React Three Fiber / Three.js (3D twin), Recharts (charts), React Router (pages).

## Optional forecast API

The browser already runs the same deterministic engine in `src/engine/deterioration.ts`. FastAPI is a replaceable mirror for later calibrated models.

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Vite proxies `/api` to that server.

## Architecture

- `src/types` — Site, Structure, Material, Forecast, and related records
- `src/data` — fixtures and data-source citations
- `src/engine` — deterioration calculation (no random numbers)
- `src/components/twin` — visualization only
- `src/pages` — Overview through Monitoring
- `backend/engine.py` — Python twin of the demonstration model

Replace the sample meshes with a GLB/glTF by setting `site.glbPath` and loading it in `SiteScene`.
