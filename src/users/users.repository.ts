import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getById(id: string) {
    return this.findOne({ where: { id } });
  }

  async add(user: User) {
    return this.save(user);
  }

  async softDeleteById(id: string) {
    const u = await this.findOne({ where: { id } });
    if (!u) return null;
    u.is_deleted = true;
    u.deleted_at = new Date();
    return this.save(u);
  }

  async restoreById(id: string) {
    const u = await this.findOne({ where: { id } });
    if (!u) return null;
    u.is_deleted = false;
    u.deleted_at = null;
    return this.save(u);
  }

  async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }
}
