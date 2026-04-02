import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    service = new AnalyticsService();
  });

  describe('trackApiCall', () => {
    it('should record an API call', () => {
      service.trackApiCall('/health', 'GET', 200, 5);
      const summary = service.getSummary();
      expect(summary.totalRequests).toBe(1);
      expect(summary.recentApiCalls).toHaveLength(1);
      expect(summary.recentApiCalls[0]).toMatchObject({
        endpoint: '/health',
        method: 'GET',
        statusCode: 200,
        responseTimeMs: 5,
      });
    });

    it('should evict oldest records when maxRecords is exceeded', () => {
      // The service keeps at most 1000 records
      for (let i = 0; i < 1002; i++) {
        service.trackApiCall(`/endpoint-${i}`, 'GET', 200, 1);
      }
      const summary = service.getSummary();
      expect(summary.totalRequests).toBe(1000);
      // The first two should have been evicted
      expect(summary.recentApiCalls[0].endpoint).not.toBe('/endpoint-0');
    });
  });

  describe('trackEvent', () => {
    it('should record a custom event', () => {
      service.trackEvent('user_signup', { plan: 'pro' });
      const summary = service.getSummary();
      expect(summary.totalEvents).toBe(1);
      expect(summary.recentEvents[0]).toMatchObject({
        eventName: 'user_signup',
        properties: { plan: 'pro' },
      });
    });

    it('should default properties to empty object when omitted', () => {
      service.trackEvent('page_view');
      const summary = service.getSummary();
      expect(summary.recentEvents[0].properties).toEqual({});
    });
  });

  describe('getSummary', () => {
    it('should return zeroed summary when no data tracked', () => {
      const summary = service.getSummary();
      expect(summary.totalRequests).toBe(0);
      expect(summary.totalEvents).toBe(0);
      expect(summary.averageResponseTimeMs).toBe(0);
      expect(summary.requestsByMethod).toEqual({});
      expect(summary.requestsByEndpoint).toEqual({});
      expect(summary.requestsByStatus).toEqual({});
      expect(summary.recentApiCalls).toEqual([]);
      expect(summary.recentEvents).toEqual([]);
      expect(summary.uptimeSeconds).toBeGreaterThanOrEqual(0);
    });

    it('should aggregate requests by method', () => {
      service.trackApiCall('/a', 'GET', 200, 5);
      service.trackApiCall('/b', 'POST', 201, 10);
      service.trackApiCall('/c', 'GET', 200, 3);
      const summary = service.getSummary();
      expect(summary.requestsByMethod).toEqual({ GET: 2, POST: 1 });
    });

    it('should aggregate requests by endpoint', () => {
      service.trackApiCall('/health', 'GET', 200, 1);
      service.trackApiCall('/health', 'GET', 200, 2);
      service.trackApiCall('/auth/login', 'POST', 200, 10);
      const summary = service.getSummary();
      expect(summary.requestsByEndpoint).toEqual({
        '/health': 2,
        '/auth/login': 1,
      });
    });

    it('should group status codes into families', () => {
      service.trackApiCall('/a', 'GET', 200, 1);
      service.trackApiCall('/b', 'POST', 201, 1);
      service.trackApiCall('/c', 'GET', 404, 1);
      service.trackApiCall('/d', 'GET', 500, 1);
      const summary = service.getSummary();
      expect(summary.requestsByStatus).toEqual({
        '2xx': 2,
        '4xx': 1,
        '5xx': 1,
      });
    });

    it('should compute average response time', () => {
      service.trackApiCall('/a', 'GET', 200, 10);
      service.trackApiCall('/b', 'GET', 200, 20);
      const summary = service.getSummary();
      expect(summary.averageResponseTimeMs).toBe(15);
    });

    it('should return at most 20 recent records', () => {
      for (let i = 0; i < 30; i++) {
        service.trackApiCall(`/e${i}`, 'GET', 200, 1);
        service.trackEvent(`event-${i}`);
      }
      const summary = service.getSummary();
      expect(summary.recentApiCalls).toHaveLength(20);
      expect(summary.recentEvents).toHaveLength(20);
    });
  });
});
