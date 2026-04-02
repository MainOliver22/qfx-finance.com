import { Controller, Get } from '@nestjs/common';
import { AnalyticsService, AnalyticsSummary } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  getSummary(): AnalyticsSummary {
    return this.analyticsService.getSummary();
  }
}
