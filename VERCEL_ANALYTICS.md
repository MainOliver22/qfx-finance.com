# Vercel Web Analytics Integration

This project has been configured with the `@vercel/analytics` package.

## Important Notes

⚠️ **Note about Backend APIs**: This is a NestJS backend API project. Vercel Web Analytics is primarily designed for tracking page views and user interactions in **frontend applications** (React, Next.js, Vue, etc.).

For backend API monitoring and observability, consider using:
- [Vercel Observability](https://vercel.com/docs/observability) for production monitoring
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights) for performance tracking
- Traditional APM tools (New Relic, Datadog, etc.) for API-specific metrics

## Current Integration

The `@vercel/analytics` package has been installed and a basic `AnalyticsService` has been created in `src/analytics/`. This service:

1. Provides a placeholder for custom event tracking
2. Can be extended when you add a frontend to this project
3. Includes logging for debugging purposes

## When This Becomes Useful

This integration will be most beneficial when you:

1. **Add a Frontend**: If you later add a web frontend (React, Next.js, etc.) that connects to this API, you can use the standard Vercel Analytics integration in your frontend code.

2. **Serve HTML Pages**: If your API serves any HTML pages, you can inject the Vercel Analytics script into those pages.

3. **Use Custom Events**: If you upgrade to a Vercel Pro or Enterprise plan, you can track custom events from your backend using the Analytics API.

## Example Frontend Integration

If you add a Next.js frontend (App Router), you would add this to your `app/layout.tsx`:

\`\`\`tsx
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
\`\`\`

For React apps, you would add this to your root component:

\`\`\`tsx
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <div>
      {/* your app content */}
      <Analytics />
    </div>
  );
}
\`\`\`

## Using the Analytics Service

The `AnalyticsService` is available throughout your NestJS application. You can inject it into any controller or service:

\`\`\`typescript
import { Injectable } from '@nestjs/common';
import { AnalyticsService } from './analytics';

@Injectable()
export class YourService {
  constructor(private readonly analyticsService: AnalyticsService) {}

  someMethod() {
    // Track custom events
    this.analyticsService.trackEvent('custom_event', { 
      property: 'value' 
    });
    
    // Track API calls
    this.analyticsService.trackApiCall('/api/endpoint', 'GET', 200);
  }
}
\`\`\`

## Enabling Analytics in Vercel Dashboard

To enable Vercel Web Analytics:

1. Go to your project in the Vercel Dashboard
2. Navigate to the Analytics tab
3. Click "Enable Web Analytics"
4. Deploy your project to Vercel

Once enabled, if you add frontend pages, analytics will automatically start tracking page views, referrers, and visitor demographics.

## Resources

- [Vercel Web Analytics Documentation](https://vercel.com/docs/analytics)
- [Vercel Analytics Quickstart](https://vercel.com/docs/analytics/quickstart)
- [Vercel Observability (for Backend APIs)](https://vercel.com/docs/observability)
