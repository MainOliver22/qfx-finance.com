import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtGuard } from './jwt.guard';
import { AdminGuard } from './admin.guard';
import { loginRateLimitMiddleware } from '../../common/middleware/login-rate-limit.middleware';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtGuard, AdminGuard],
  exports: [JwtGuard, AdminGuard, AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(loginRateLimitMiddleware)
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });
  }
}
