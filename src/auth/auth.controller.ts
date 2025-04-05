import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  LoginDto,
  SendOtpDto,
  VerifyDto,
} from './dto/create-auth.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post()
  login(@Body() loginAuthDto: LoginDto, @Req() req: Request) {
    return this.authService.login(loginAuthDto, req);
  }

  @Post()
  sendOTP(@Body() sendOtphDto: SendOtpDto) {
    return this.authService.sendOTP(sendOtphDto);
  }

  @Post()
  verify(@Body() verifyDto: VerifyDto) {
    return this.authService.verify(verifyDto);
  }
}
