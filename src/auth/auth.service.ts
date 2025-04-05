import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateAuthDto,
  LoginDto,
  SendOtpDto,
  VerifyDto,
} from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import * as DeviseDetector from 'device-detector-js';
import * as bcrypt from 'bcrypt';
import { totp } from 'otplib';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
totp.options = { step: 600, digits: 5 };

@Injectable()
export class AuthService {
  private readonly deviceDetector = new DeviseDetector();
  private acckey = process.env.ACCKEY;
  private refkey = process.env.REFKEY;
  private otpkey = process.env.OTPKEY;

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    let { email, password } = createAuthDto;
    try {
      let user = await this.prisma.user.findUnique({ where: { email } });
      if (user) {
        throw new ConflictException('User already exists');
      }

      let hashpass = bcrypt.hashSync(password, 10);
      await this.prisma.user.create({
        data: { ...createAuthDto, password: hashpass },
      });

      let otp = totp.generate(this.otpkey + email);
      await this.mailService.sendMail(
        email,
        'Activate account',
        `Code for verifed account - ${otp}`,
      );

      return {
        data: 'Registered, the code was sent to your email, please activate your account',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginAuthDto: LoginDto, req: Request) {
    let { email, password } = loginAuthDto;
    try {
      let user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('Unauthorized');
      }

      let match = bcrypt.compareSync(password, user.password);
      if (!match) {
        throw new BadRequestException('Email or password is wrong');
      }

      if (user.status != 'ACTIVE') {
        throw new BadRequestException(
          'Your account is not active, please activate your account',
        );
      }

      let session = await this.prisma.session.findFirst({
        where: { userId: user.id, ipAdress: req.ip },
      });
      if (!session) {
        let userAgent: any = req.headers['user-agent'];
        let device: any = this.deviceDetector.parse(userAgent);
        let newSession = {
          ipAdress: req.ip!,
          userId: user.id,
          info: device,
        };
        await this.prisma.session.create({ data: newSession });
      }

      await this.mailService.sendMail(
        email,
        'New Login',
        'Somebody logined into your account',
      );

      let accessToken = this.genAccessToken({ id: user.id, role: user.role });
      let refreshToken = this.genRefreshToken({ id: user.id, role: user.role });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verify(verifyDto: VerifyDto) {
    let { email, otp } = verifyDto;
    try {
      let isValid = totp.check(otp, this.otpkey + email);
      if (!isValid) {
        throw new BadRequestException('One-time-password or email is wrong');
      }

      let user = await this.prisma.user.update({
        where: { email },
        data: { status: 'ACTIVE' },
      });

      return { data: 'Your account has been successfully activated', user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async sendOTP(sendOtphDto: SendOtpDto) {
    try {
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  genAccessToken(payload: object) {
    return this.jwtService.sign(payload, {
      secret: this.acckey,
      expiresIn: '12',
    });
  }

  genRefreshToken(payload: object) {
    return this.jwtService.sign(payload, {
      secret: this.refkey,
      expiresIn: '7d',
    });
  }
}
