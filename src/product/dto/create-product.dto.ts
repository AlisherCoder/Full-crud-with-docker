import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Ball' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(2)
  name: string;

  @ApiProperty({ example: ['image.jpg'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  count: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  categoryId: number;
}
