# QFX Finance Docs

## Overview

QFX Finance is a NestJS backend API project.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Build the project:

```bash
npm run build
```

3. Start the app:

```bash
npm start
```

## Deployment

See these repository docs for deployment details:

- `DEPLOYMENT.md`
- `deploy_and_verify.sh`
- `docker-compose.yml`

## Analytics Guidance

This repository is backend-only. Vercel Web Analytics is primarily intended for frontend page tracking.

If you also have a frontend app, integrate `@vercel/analytics` in that frontend project. For backend observability, use API logs and monitoring tools.

More details are available in `VERCEL_ANALYTICS.md`.

## Known Build Notes

Current known blockers in this repository:

- Missing Express type declarations if not already installed (`@types/express`)
- Missing auth module files referenced from `src/modules/auth/auth.module.ts`
