import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { QueryUserDto } from 'src/auth/dto/query-user.dto';
import { UpdateAuthDto } from 'src/auth/dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryUserDto) {
    let { name, email, page = 1, limit = 10, orderBy = 'asc' } = query;
    try {
      let data = await this.prisma.user.findMany({
        where: {
          name: name ? { mode: 'insensitive', contains: name } : undefined,
          email: email ? { mode: 'insensitive', contains: email } : undefined,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          name: orderBy,
        },
      });

      if (!data.length) {
        return new NotFoundException('Not found data');
      }
      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getMydata(req: Request) {
    let user = req['user'];
    try {
      let session = await this.prisma.session.findFirst({
        where: { userId: user.id, ipAdress: req.ip },
      });
      if (!session) {
        return new UnauthorizedException('Unauthorized');
      }
      let data = await this.prisma.user.findUnique({ where: { id: user.id } });
      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getMySession(req: Request) {
    let user = req['user'];
    try {
      let session = await this.prisma.session.findFirst({
        where: { userId: user.id, ipAdress: req.ip },
      });
      if (!session) {
        return new UnauthorizedException('Unauthorized');
      }
      let data = await this.prisma.session.findMany({
        where: { userId: user.id },
      });
      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async logout(req: Request) {
    let user = req['user'];
    try {
      await this.prisma.session.deleteMany({
        where: { userId: user.id, ipAdress: req.ip },
      });

      return { data: 'Logout' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteSession(req: Request, id: number) {
    let user = req['user'];
    console.log(user);
    try {
      await this.prisma.session.delete({
        where: { id, userId: user.id },
      });

      return { data: 'Session deleted' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      let data = await this.prisma.user.findUnique({ where: { id } });

      if (!data) {
        return new NotFoundException('Not found data');
      }
      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateAuthDto) {
    try {
      let data = await this.prisma.user.findUnique({ where: { id } });

      if (!data) {
        return new NotFoundException('Not found data');
      }

      let updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });

      if (updateUserDto.images?.length) {
        data.images.forEach((image) => {
          let filepath = join('uploads', image);
          try {
            unlinkSync(filepath);
          } catch (error) {
            console.log(error.message);
          }
        });
      }
      return { data: updatedUser };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      let data = await this.prisma.user.delete({ where: { id } });

      if (!data) {
        return new NotFoundException('Not found data');
      }

      if (data.images.length) {
        data.images.forEach((image) => {
          let filepath = join('uploads', image);
          try {
            unlinkSync(filepath);
          } catch (error) {
            console.log(error.message);
          }
        });
      }

      await this.prisma.session.deleteMany({ where: { userId: data.id } });
      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
