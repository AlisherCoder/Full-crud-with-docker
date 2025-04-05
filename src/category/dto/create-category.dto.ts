import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Sport' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(32)
  name: string;
}
