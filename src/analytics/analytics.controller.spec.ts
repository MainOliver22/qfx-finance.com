import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  beforeEach(() => {
    service = new AnalyticsService();
    controller = new AnalyticsController(service);
  });

  it('should return a summary from the analytics service', () => {
    service.trackApiCall('/health', 'GET', 200, 5);
    service.trackEvent('test_event', { key: 'value' });

    const result = controller.getSummary();

    expect(result.totalRequests).toBe(1);
    expect(result.totalEvents).toBe(1);
    expect(result.recentApiCalls).toHaveLength(1);
    expect(result.recentEvents).toHaveLength(1);
  });

  it('should return empty summary when nothing tracked', () => {
    const result = controller.getSummary();
    expect(result.totalRequests).toBe(0);
    expect(result.totalEvents).toBe(0);
  });
});
