import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';

/**
 * Middleware that records every HTTP request so the
 * AnalyticsService can build usage summaries.
 */
@Injectable()
export class AnalyticsMiddleware implements NestMiddleware {
  constructor(private readonly analyticsService: AnalyticsService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
      const responseTimeMs = Date.now() - start;
      this.analyticsService.trackApiCall(
        req.originalUrl || req.url,
        req.method,
        res.statusCode,
        responseTimeMs,
      );
    });

    next();
  }
}
