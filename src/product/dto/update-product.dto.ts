import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ example: 'Ball' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(2)
  name?: string;

  @ApiProperty({ example: ['image.jpg'] })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({ example: 50000 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(0)
  count?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  categoryId?: number;
}
