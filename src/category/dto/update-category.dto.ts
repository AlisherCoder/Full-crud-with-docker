import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Home' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  name?: string;
}
