import { Request, Response, NextFunction } from 'express';

const rateLimit = require('express-rate-limit');

// Tight limiter for the login endpoint: 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    statusCode: 429,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
});

export const loginRateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  loginLimiter(req, res, next);
};
