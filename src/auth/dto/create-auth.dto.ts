import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ example: 'Alex' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: ['image.jpg'] })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  image?: string[];

  @ApiProperty({ example: 'alex@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'The password must consist of numbers and letters.',
  })
  @MinLength(4)
  @MaxLength(32)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'The password must consist of numbers and letters.',
  })
  @MinLength(4)
  @MaxLength(32)
  password: string;
}

export class SendOtpDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'The password must consist of numbers and letters.',
  })
  @MinLength(4)
  @MaxLength(32)
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
