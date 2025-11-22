import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersMapper } from './users.mapper';
import { User } from './entities/user.entity';
import { PasswordResetEmailService } from './email/password-reset-email.service';
import { MessageService } from '../common/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersMapper, PasswordResetEmailService, UsersRepository, MessageService],
  exports: [UsersService],
})
export class UsersModule {}
