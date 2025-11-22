import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersMapper } from './users.mapper';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { MessageService } from '../common/message.service';
import { PasswordResetEmailService } from './email/password-reset-email.service';

@Injectable()
export class UsersService {
  constructor(
    private repo: UsersRepository,
    private mapper: UsersMapper,
    private dataSource: DataSource,
    private messageService: MessageService,
    private emailService: PasswordResetEmailService,
  ) {}

  async getAll(): Promise<any> {
    const users = await this.repo.find({ where: { is_deleted: false } });
    if (!users || users.length === 0) throw new NotFoundException(this.messageService.get('getAllUser404'));
    const dtos = users.map(u => this.mapper.toDto(u));
    return { total: dtos.length, items: dtos };
  }

  async getById(id: string) {
    const user = await this.repo.getById(id);
    if (!user) throw new NotFoundException(this.messageService.get('controllerUser404'));
    return this.mapper.toDto(user);
  }

  async create(createDto: CreateUserDto) {
    // Validación de existencia
    const exists = await this.repo.findOne({ where: [{ email: createDto.email }, { username: createDto.username }] });
    if (exists) throw new BadRequestException(this.messageService.get('AddAsyncUser409'));

    const user = new User();
    user.username = createDto.username;
    user.email = createDto.email;
    user.first_name = createDto.first_name;
    user.last_name = createDto.last_name;
    user.password = await bcrypt.hash(createDto.password, 12);
    user.is_active = createDto.is_active ?? true;
    user.is_superuser = createDto.is_superuser ?? false;

    await this.repo.add(user);
    return this.mapper.toDto(user);
  }

  async update(id: string, updateDto: any) {
    const user = await this.repo.getById(id);
    if (!user) throw new NotFoundException(this.messageService.get('controllerUser404'));

    user.username = updateDto.username;
    user.email = updateDto.email;
    user.first_name = updateDto.first_name;
    user.last_name = updateDto.last_name;
    user.password = await bcrypt.hash(updateDto.password, 12);
    user.modified_at = new Date();
    await this.repo.save(user);
    return this.mapper.toDto(user);
  }

  async patch(id: string, patchDto: PatchUserDto) {
    const user = await this.repo.getById(id);
    if (!user) throw new NotFoundException(this.messageService.get('controllerUser404'));
    if (user.is_deleted) throw new BadRequestException('Usuario eliminado');

    user.first_name = patchDto.first_name ?? user.first_name;
    user.last_name = patchDto.last_name ?? user.last_name;
    user.email = patchDto.email ?? user.email;
    user.modified_at = new Date();
    await this.repo.save(user);
    return this.mapper.toDto(user);
  }

  async delete(id: string) {
    const user = await this.repo.getById(id);
    if (!user) throw new NotFoundException(this.messageService.get('controllerUser404'));
    if (user.is_deleted) throw new BadRequestException('Usuario ya eliminado');
    await this.repo.softDeleteById(id);
    return { ok: true };
  }

  async restore(id: string) {
    const restored = await this.repo.restoreById(id);
    if (!restored) throw new NotFoundException(this.messageService.get('controllerUser404'));
    return this.mapper.toDto(restored);
  }

  async changePassword(id: string, model: ChangePasswordDto) {
    const user = await this.repo.getById(id);
    if (!user) throw new NotFoundException(this.messageService.get('controllerUser404'));

    if (!await bcrypt.compare(model.currentPassword, user.password)) {
      throw new BadRequestException(this.messageService.get('ChangePasswordAsyncUser400'));
    }

    if (model.newPassword !== model.confirmPassword) throw new BadRequestException('No coinciden las contraseñas');
    if (model.newPassword.length < 8 || !/[0-9]/.test(model.newPassword) || !/[A-Za-z]/.test(model.newPassword)) {
      throw new BadRequestException('Nueva contraseña no cumple requisitos');
    }

    user.password = await bcrypt.hash(model.newPassword, 12);
    await this.repo.save(user);
    return { ok: true };
  }

  async requestPasswordReset(email: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new NotFoundException('Email no registrado');
    const token = Math.random().toString(36).slice(2); // generar token real en prod
    // Guardar token en tabla o cache con expiración (omitted)
    await this.emailService.sendReset(email, token);
    return { ok: true };
  }

  async verifyEmail(id: string) {
    const user = await this.repo.getById(id);
    if (!user) throw new NotFoundException(this.messageService.get('controllerUser404'));
    if (user.email_verified) throw new BadRequestException('Email ya verificado');
    user.email_verified = true;
    user.email_verified_at = new Date();
    await this.repo.save(user);
    return this.mapper.toDto(user);
  }
}
