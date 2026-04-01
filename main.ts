import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { rateLimitMiddleware } from './src/common/middleware/rate-limit.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global rate limiter (100 req / 15 min per IP)
  app.use(rateLimitMiddleware);

  // Reject payloads that fail validation and strip unknown fields
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();