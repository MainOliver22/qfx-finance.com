import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

export interface AuthUser {
  sub: string;
  username: string;
  role: 'admin' | 'user';
}

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET ?? 'dev-secret';

  // Minimal credential check for local/dev usage.
  validateCredentials(username: string, password: string): AuthUser {
    const adminUser = process.env.ADMIN_USERNAME ?? 'admin';
    const adminPass = process.env.ADMIN_PASSWORD ?? 'admin123';

    if (username === adminUser && password === adminPass) {
      return {
        sub: '1',
        username,
        role: 'admin',
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  signToken(user: AuthUser): string {
    return sign(user, this.jwtSecret, {
      expiresIn: '1h',
      issuer: 'qfx-finance-api',
    });
  }
}
