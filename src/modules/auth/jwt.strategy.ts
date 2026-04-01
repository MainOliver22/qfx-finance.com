import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { AuthUser } from './auth.service';

@Injectable()
export class JwtStrategy {
  private readonly jwtSecret = process.env.JWT_SECRET ?? 'dev-secret';

  validateToken(token: string): AuthUser {
    try {
      const payload = verify(token, this.jwtSecret, {
        issuer: 'qfx-finance-api',
      });

      return payload as AuthUser;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
