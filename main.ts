import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { rateLimitMiddleware } from './src/common/middleware/rate-limit.middleware';
import { AllExceptionsFilter } from './src/common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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