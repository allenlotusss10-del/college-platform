# College Platform

A full-stack college discovery and comparison app built with Next.js, Express, and PostgreSQL.

---

## Project structure

```
college-platform/
├── frontend/   Next.js 15 app
└── backend/    Express + TypeScript API
```

---

## Environment variables

### Backend — `backend/.env`

Copy `backend/.env.example` to `backend/.env` and fill in the values.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `PORT` | No | API port (default: `5000`) |
| `FRONTEND_URL` | ✅ Yes (prod) | Frontend origin for CORS, e.g. `https://your-app.vercel.app` |

### Frontend — `frontend/.env.local`

Copy `frontend/.env.example` to `frontend/.env.local` and fill in the values.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ Yes (prod) | Full URL of the deployed backend, e.g. `https://your-api.railway.app` |

---

## Local development

### Option A — Docker Compose (recommended, runs everything)

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Postgres: localhost:5432

### Option B — Run each service manually

**1. Start a local PostgreSQL database** (or use a cloud DB).

**2. Backend**

```bash
cd backend
cp .env.example .env          # then edit DATABASE_URL
npm install
npm run dev
```

**3. Frontend**

```bash
cd frontend
cp .env.example .env.local    # then edit NEXT_PUBLIC_API_URL if needed
npm install
npm run dev
```

---

## Production deployment

### Backend — Railway / Render / Fly.io

1. Create a PostgreSQL database on your platform and copy the connection string.
2. Set these environment variables on your backend service:
   ```
   DATABASE_URL=<your-postgres-url>
   FRONTEND_URL=https://your-frontend.vercel.app
   PORT=5000
   ```
3. The `npm run build` (compiles TypeScript) and `npm start` (runs `dist/index.js`) scripts are ready to use. Most platforms detect these automatically.

### Frontend — Vercel (recommended for Next.js)

1. Import the `frontend/` folder as your Vercel project root.
2. Set this environment variable in Vercel's dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
3. Deploy. Vercel handles `next build` automatically.

### Full Docker deployment

Build and push images for both services, then set the same env vars listed above on your container platform.

```bash
# Build backend image
docker build -t college-platform-api ./backend

# Build frontend image (pass API URL at build time)
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://your-api.railway.app \
  -t college-platform-web ./frontend
```

---

## API endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/colleges` | List all colleges. Supports `?search=` and `?location=` |
| `GET` | `/api/colleges/:id` | Get a single college by ID |

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind CSS 4, TypeScript |
| Backend | Express 5, TypeScript, node-postgres |
| Database | PostgreSQL 16 |
| Containerisation | Docker, Docker Compose |
