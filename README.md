# Archive In-Situ

Interactive heritage map of 29 Dutch collective housing projects (1921–2030).

## Development

```bash
# Start API server
cd server && npm install && npm run dev

# Start client (new terminal)
cd client && npm install && npm run dev
```

Open http://localhost:5173

## Updating the data

**To add or edit a project:** Open `/server/data/housing-atlas.json` and edit the array.
Fields: id (unique int), name, lat/lng (decimal degrees or null), city, architect, era
(must be one of the 10 decade strings), social_org (free text or null), scale
("21-50" | "51-100" | "101-200" | ">201" | null), note (free text or null).
The server reads this file on every request — no rebuild needed.

**To add a 3D splat scene:** Open `/server/data/splats-index.json`.
Add an entry: `"PROJECT_ID": "https://your-cdn.com/scene.splat"`.
Uses project id as the key (string). No rebuild needed.

**To restyle the app:** Open `/client/src/styles/tokens.css`.
Change any CSS variable. All components read from tokens — nothing else changes.

## Docker

```bash
docker compose build
docker compose up
```

API: http://localhost:3001
Client: http://localhost:5173
