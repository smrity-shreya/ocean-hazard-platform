# ARETE FORGE — Ocean Hazard Reporting Platform (MVP)

Fullstack MVP for SIH25039: crowdsourced ocean hazard reporting with role-based
access (User / Analyst / Official), geotagged reports, a live risk map, and
official alerts.

**Stack:** React (Vite) + Node/Express + MongoDB (Mongoose), JWT auth.

## Folder structure
```
arete-forge/
  backend/    Express API, MongoDB models, JWT auth, zone-risk algorithm
  frontend/   React app (Vite), Leaflet map, role-based pages
```

## 1. Backend setup
```bash
cd backend
cp .env.example .env     # edit MONGO_URI / JWT_SECRET as needed
npm install
npm run seed              # creates demo accounts + sample reports
npm run dev                # starts on http://localhost:5000
```
Demo accounts (password: `password123`):
- user@demo.com (citizen)
- analyst@demo.com
- official@demo.com

## 2. Frontend setup
```bash
cd frontend
cp .env.example .env      # VITE_API_BASE_URL=http://localhost:5000/api
npm install
npm run dev                # starts on http://localhost:5173
```

## 3. Core flow
1. Register/login as a citizen (`user` role) → submit a hazard report with
   type, description, severity, and lat/lng (or use "Use My Current Location").
2. Login as `analyst` or `official` → open **Dashboard** to verify/reject/
   escalate pending reports.
3. **Hazard Map** (public) renders color-coded risk zones computed by the
   backend's grid + recency-decay algorithm (`backend/src/utils/zoneRisk.js`),
   plus individual report markers.
4. Login as `official` → **Alerts** page to broadcast a zone alert; visible
   to all roles.

## API summary
| Method | Route | Role | Description |
|---|---|---|---|
| POST | /api/auth/register | public | create account (role defaults to `user`) |
| POST | /api/auth/login | public | returns JWT |
| GET  | /api/auth/me | any | current user |
| POST | /api/reports | user | submit hazard report |
| GET  | /api/reports | analyst, official | list/filter reports |
| GET  | /api/reports/mine | user | own submitted reports |
| GET  | /api/reports/zones | any | computed risk zones for map |
| PATCH| /api/reports/:id/status | analyst, official | verify/reject/escalate |
| POST | /api/alerts | official | issue zone alert |
| GET  | /api/alerts | any | active alerts |
| PATCH| /api/alerts/:id/deactivate | official | close an alert |

## Notes / next steps for full scope
- This is the MVP core (auth, reports, map, dashboard, alerts) as scoped.
  Offline-first sync, multilingual UI, social-media NLP ingestion, and
  ML-based hazard classification from the original problem statement are not
  included here — happy to layer those in next.
- For production: move uploaded media to object storage (S3/GCS) instead of
  raw URLs, add rate limiting, and run MongoDB with replica set + indexes
  already defined on `HazardReport`.
