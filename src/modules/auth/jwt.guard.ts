import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.slice('Bearer '.length).trim();

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const user = this.jwtStrategy.validateToken(token);
    (request as Request & { user: unknown }).user = user;

    return true;
  }
}
