import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryProductDto } from './dto/query-product.dto';
import { join } from 'path';
import { unlinkSync } from 'fs';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      let data = await this.prisma.product.create({ data: createProductDto });
      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(query: QueryProductDto) {
    let { page = 1, limit = 10, sortBy = 'name', orderBy = 'asc' } = query;
    let whereFilter: any = {};

    if (query.name) {
      whereFilter.name = { mode: 'insensitive', contains: query.name };
    }

    if (query.count) {
      whereFilter.count = query.count;
    }

    whereFilter.price = {
      gte: query.minPrice || undefined,
      lte: query.maxPrice || undefined,
      equals: query.price || undefined,
    };

    try {
      let data = await this.prisma.product.findMany({
        where: whereFilter,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: orderBy,
        },
        include: { Category: true },
      });

      if (!data.length) {
        throw new NotFoundException('Not found data');
      }
      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      let data = await this.prisma.product.findUnique({
        where: { id },
        include: { Category: true },
      });
      if (!data) {
        throw new NotFoundException('Not found data');
      }
      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      let product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException('Not found data');
      }

      let data = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });

      if (updateProductDto.images && updateProductDto.images.length) {
        product.images.forEach((image) => {
          let filepath = join('uploads', image);
          try {
            unlinkSync(filepath);
          } catch (error) {
            console.log(error.message);
          }
        });
      }

      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      let product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException('Not found data');
      }

      let data = await this.prisma.product.delete({ where: { id } });
      data.images.forEach((image) => {
        let filepath = join('uploads', image);
        try {
          unlinkSync(filepath);
        } catch (error) {
          console.log(error.message);
        }
      });

      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
