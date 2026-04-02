# Vercel Analytics Integration

This project includes a fully functional server-side analytics system powered by the `@vercel/analytics` package and a custom `AnalyticsModule`.

## Features

- **Automatic request tracking** – Every HTTP request is recorded by the `AnalyticsMiddleware` (method, path, status code, response time).
- **Custom event tracking** – Use `AnalyticsService.trackEvent()` from any controller or service.
- **Real-time summary endpoint** – `GET /analytics` returns aggregated metrics.
- **In-memory storage** – The last 1 000 API calls and 1 000 custom events are retained per process.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Build and run

```bash
npm run build
npm start
```

### 3. Query analytics

```bash
curl http://localhost:3000/analytics
```

The response includes:

| Field                  | Description                                         |
|------------------------|-----------------------------------------------------|
| `totalRequests`        | Number of API calls recorded                        |
| `totalEvents`          | Number of custom events recorded                    |
| `averageResponseTimeMs`| Average response time across all recorded calls     |
| `requestsByMethod`     | Breakdown by HTTP method (GET, POST, …)             |
| `requestsByEndpoint`   | Breakdown by endpoint path                          |
| `requestsByStatus`     | Breakdown by status code family (2xx, 4xx, 5xx)     |
| `recentApiCalls`       | Last 20 API call records                            |
| `recentEvents`         | Last 20 custom event records                        |
| `uptimeSeconds`        | Seconds since the AnalyticsService was initialised  |

## Deploying to Vercel

A `vercel.json` is included in the repository root. To deploy:

1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` from the project root and follow the prompts.
3. Enable **Web Analytics** in the Vercel Dashboard → your project → Analytics tab.

For production, set the required environment variables (`JWT_SECRET`, etc.) in the Vercel project settings.

## Using the Analytics Service

Inject `AnalyticsService` into any controller or service:

```typescript
import { Injectable } from '@nestjs/common';
import { AnalyticsService } from './analytics';

@Injectable()
export class YourService {
  constructor(private readonly analyticsService: AnalyticsService) {}

  someMethod() {
    // Track a custom event
    this.analyticsService.trackEvent('user_signup', { plan: 'pro' });
  }
}
```

## Architecture

```
AnalyticsModule
├── AnalyticsMiddleware  – intercepts every request (applied globally)
├── AnalyticsService     – stores records & computes summaries
└── AnalyticsController  – exposes GET /analytics
```

## Resources

- [Vercel Web Analytics Documentation](https://vercel.com/docs/analytics)
- [Vercel Analytics Quickstart](https://vercel.com/docs/analytics/quickstart)
- [Vercel Observability (for Backend APIs)](https://vercel.com/docs/observability)
