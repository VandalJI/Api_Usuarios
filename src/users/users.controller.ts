import { Controller, Get, Post, Put, Patch, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('api/users')
export class UsersController {
  constructor(private svc: UsersService) {}

  @Get()
  async getAll() {
    return this.svc.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.svc.getById(id);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.svc.create(dto);
    return { status: 201, message: 'Usuario creado', data: user };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.svc.update(id, dto);
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: PatchUserDto) {
    return this.svc.patch(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    return this.svc.delete(id);
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string) {
    return this.svc.restore(id);
  }

  @Post(':id/verify-email')
  async verifyEmail(@Param('id') id: string) {
    return this.svc.verifyEmail(id);
  }

  @Post(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDto
  ) {
    return this.svc.changePassword(id, dto);
  }

}
