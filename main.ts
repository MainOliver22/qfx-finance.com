import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { rateLimitMiddleware } from './src/common/middleware/rate-limit.middleware';
import { AllExceptionsFilter } from './src/common/filters/all-exceptions.filter';

function validateEnv() {
  const required = ['JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create(AppModule);

  // CORS — restrict to explicit allowlist in production
  const allowedOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Security headers
  app.use(helmet());

  // Global rate limiter (100 req / 15 min per IP)
  app.use(rateLimitMiddleware);

  // Consistent error response shape across all routes
  app.useGlobalFilters(new AllExceptionsFilter());

  // Reject payloads that fail validation and strip unknown fields
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();