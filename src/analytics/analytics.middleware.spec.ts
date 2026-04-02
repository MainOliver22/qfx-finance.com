import { AnalyticsMiddleware } from './analytics.middleware';
import { AnalyticsService } from './analytics.service';
import { Request, Response } from 'express';
import { EventEmitter } from 'events';

describe('AnalyticsMiddleware', () => {
  let middleware: AnalyticsMiddleware;
  let service: AnalyticsService;

  beforeEach(() => {
    service = new AnalyticsService();
    middleware = new AnalyticsMiddleware(service);
  });

  function mockReqRes(
    method: string,
    url: string,
    statusCode: number,
  ): { req: Request; res: Response & EventEmitter } {
    const req = { method, originalUrl: url, url } as unknown as Request;
    const res = new EventEmitter() as Response & EventEmitter;
    (res as unknown as { statusCode: number }).statusCode = statusCode;
    return { req, res };
  }

  it('should call next immediately', () => {
    const { req, res } = mockReqRes('GET', '/health', 200);
    const next = jest.fn();
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should track the API call when the response finishes', () => {
    const spy = jest.spyOn(service, 'trackApiCall');
    const { req, res } = mockReqRes('POST', '/auth/login', 201);
    const next = jest.fn();

    middleware.use(req, res, next);
    res.emit('finish');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      '/auth/login',
      'POST',
      201,
      expect.any(Number),
    );
  });

  it('should use originalUrl over url when available', () => {
    const spy = jest.spyOn(service, 'trackApiCall');
    const req = {
      method: 'GET',
      originalUrl: '/original',
      url: '/fallback',
    } as unknown as Request;
    const res = new EventEmitter() as Response & EventEmitter;
    (res as unknown as { statusCode: number }).statusCode = 200;
    const next = jest.fn();

    middleware.use(req, res, next);
    res.emit('finish');

    expect(spy).toHaveBeenCalledWith('/original', 'GET', 200, expect.any(Number));
  });
});
