import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      let data = await this.prisma.category.create({ data: createCategoryDto });
      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(query: QueryCategoryDto) {
    let { name, page = 1, limit = 10 } = query;
    let whereFilter: any = {};

    if (name) {
      whereFilter.name = { mode: 'insensitive', contains: name };
    }

    try {
      let data = await this.prisma.category.findMany({
        where: whereFilter,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          name: 'asc',
        },
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
      let data = await this.prisma.category.findUnique({
        where: { id },
        include: { Product: true },
      });
      if (!data) {
        throw new NotFoundException('Not found data');
      }
      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      let data = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
      if (!data) {
        throw new NotFoundException('Not found data');
      }
      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      let data = await this.prisma.category.delete({ where: { id } });
      if (!data) {
        throw new NotFoundException('Not found data');
      }
      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
