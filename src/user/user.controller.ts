import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateAuthDto } from 'src/auth/dto/update-auth.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiQuery } from '@nestjs/swagger';
import { QueryUserDto } from 'src/auth/dto/query-user.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role, Roles } from 'src/guards/roles.decorator';
import { SelfGuard } from 'src/guards/self.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiQuery({ name: 'orderBy', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'email', required: false, type: 'string' })
  @ApiQuery({ name: 'name', required: false, type: 'string' })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get('mydata')
  getMydata(@Req() req: Request) {
    return this.userService.getMydata(req);
  }

  @UseGuards(AuthGuard)
  @Get('mysession')
  getMySession(@Req() req: Request) {
    return this.userService.getMySession(req);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    return this.userService.logout(req);
  }

  @UseGuards(AuthGuard)
  @Get('deletesession/:id')
  deleteSession(@Req() req: Request, @Param('id') id: number) {
    return this.userService.deleteSession(req, +id);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateAuthDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
