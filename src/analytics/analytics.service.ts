import { Injectable, Logger } from '@nestjs/common';

export interface ApiCallRecord {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTimeMs: number;
  timestamp: string;
}

export interface CustomEventRecord {
  eventName: string;
  properties: Record<string, unknown>;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalRequests: number;
  totalEvents: number;
  averageResponseTimeMs: number;
  requestsByMethod: Record<string, number>;
  requestsByEndpoint: Record<string, number>;
  requestsByStatus: Record<string, number>;
  recentApiCalls: ApiCallRecord[];
  recentEvents: CustomEventRecord[];
  uptimeSeconds: number;
}

/**
 * Analytics Service for tracking API usage and custom events.
 *
 * Stores metrics in memory and exposes aggregated summaries
 * that can be queried via the AnalyticsController.
 */
@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly apiCalls: ApiCallRecord[] = [];
  private readonly customEvents: CustomEventRecord[] = [];
  private readonly startTime = Date.now();

  /** Maximum number of records kept in memory per collection. */
  private readonly maxRecords = 1000;

  constructor() {
    this.logger.log('Analytics Service initialized');
  }

  /**
   * Track a custom event.
   * @param eventName - Name of the event to track
   * @param properties - Optional event properties
   */
  trackEvent(eventName: string, properties?: Record<string, unknown>): void {
    const record: CustomEventRecord = {
      eventName,
      properties: properties ?? {},
      timestamp: new Date().toISOString(),
    };
    this.customEvents.push(record);
    if (this.customEvents.length > this.maxRecords) {
      this.customEvents.shift();
    }
    this.logger.debug(`Event tracked: ${eventName}`, properties);
  }

  /**
   * Track an API call with response metadata.
   * @param endpoint - API endpoint path
   * @param method - HTTP method
   * @param statusCode - Response status code
   * @param responseTimeMs - Response time in milliseconds
   */
  trackApiCall(
    endpoint: string,
    method: string,
    statusCode: number,
    responseTimeMs: number,
  ): void {
    const record: ApiCallRecord = {
      endpoint,
      method,
      statusCode,
      responseTimeMs,
      timestamp: new Date().toISOString(),
    };
    this.apiCalls.push(record);
    if (this.apiCalls.length > this.maxRecords) {
      this.apiCalls.shift();
    }
    this.logger.debug(
      `API call: ${method} ${endpoint} - ${statusCode} (${responseTimeMs}ms)`,
    );
  }

  /**
   * Return an aggregated summary of all tracked analytics data.
   */
  getSummary(): AnalyticsSummary {
    const requestsByMethod: Record<string, number> = {};
    const requestsByEndpoint: Record<string, number> = {};
    const requestsByStatus: Record<string, number> = {};
    let totalResponseTime = 0;

    for (const call of this.apiCalls) {
      requestsByMethod[call.method] =
        (requestsByMethod[call.method] ?? 0) + 1;
      requestsByEndpoint[call.endpoint] =
        (requestsByEndpoint[call.endpoint] ?? 0) + 1;
      const statusGroup = `${Math.floor(call.statusCode / 100)}xx`;
      requestsByStatus[statusGroup] =
        (requestsByStatus[statusGroup] ?? 0) + 1;
      totalResponseTime += call.responseTimeMs;
    }

    const totalRequests = this.apiCalls.length;
    const recentCount = 20;

    return {
      totalRequests,
      totalEvents: this.customEvents.length,
      averageResponseTimeMs:
        totalRequests > 0
          ? Math.round(totalResponseTime / totalRequests)
          : 0,
      requestsByMethod,
      requestsByEndpoint,
      requestsByStatus,
      recentApiCalls: this.apiCalls.slice(-recentCount),
      recentEvents: this.customEvents.slice(-recentCount),
      uptimeSeconds: Math.round((Date.now() - this.startTime) / 1000),
    };
  }
}
