import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshGuard implements CanActivate {
  private refkey = process.env.REFKEY;
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    let request: Request = context.switchToHttp().getRequest();
    let { refreshToken } = request.body;

    if (!refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      let data = this.jwtService.verify(refreshToken, { secret: this.refkey });
      request['user'] = data;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
