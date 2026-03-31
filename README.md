# QFX Finance API

Backend API service built with NestJS.

## Requirements

- Node.js 18+
- npm 9+

## Quick Start (Local)

1. Clone and enter the project:

```bash
git clone https://github.com/MainOliver22/qfx-finance.com.git
cd qfx-finance.com
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Build TypeScript:

```bash
npm run build
```

4. Start the API:

```bash
npm start
```

The API runs on port `3000`.

## Health Check

Verify the service is running:

```bash
curl http://localhost:3000/health
```

Expected response includes:

- `status: "ok"`
- `timestamp`
- `uptime`

## Environment Variables

The current code does not strictly require env vars to boot, but keep a `.env` for future modules:

```bash
cp .env.example .env
```

Common values in `.env`:

- `APP_PORT=3000`
- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_NAME=qfx_finance`
- `DB_USER=dev_user`
- `DB_PASS=dev_password`
- `JWT_SECRET=change_me`

## Docker

Build and start with Docker Compose:

```bash
docker compose up --build -d
```

Note: the compose setup pins PostgreSQL to version 16 for compatibility and predictable startup.

View service status:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f app
```

Stop containers:

```bash
docker compose down
```

## VPS Deployment (Simple)

Run on your VPS with Node:

```bash
git clone https://github.com/MainOliver22/qfx-finance.com.git
cd qfx-finance.com
npm install --legacy-peer-deps
npm run build
npm start
```

Then confirm from the VPS:

```bash
curl http://localhost:3000/health
```

## Troubleshooting

- `Error: Cannot find module dist/main.js`
  Build first: `npm run build`

- `ERESOLVE unable to resolve dependency tree`
  Use: `npm install --legacy-peer-deps`

- Port `3000` already in use
  Stop the process on that port or change runtime port handling in bootstrap logic.