import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from './auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as Request & { user?: AuthUser }).user;

    if (!user) {
      throw new ForbiddenException('User context is required');
    }

    if (user.role !== 'admin') {
      throw new ForbiddenException('Admin role required');
    }

    return true;
  }
}
