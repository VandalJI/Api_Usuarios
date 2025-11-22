import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 128 })
  password: string;

  @Column({ type: 'timestamptz', nullable: true })
  last_login?: Date;

  @Column({ default: false })
  is_superuser: boolean;

  @Column({ length: 150 })
  first_name: string;

  @Column({ length: 150 })
  last_name: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date_joined: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  modified_at: Date;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at?: Date;

  @Column({ length: 20, unique: true })
  username: string;

  @Column({ length: 254, nullable: true })
  email?: string;

  @Column({ length: 100, nullable: true })
  profile_picture?: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  email_verified_at?: Date;

  @Column({ length: 7, nullable: true })
  nationality?: string;

  @Column({ length: 17, nullable: true })
  occupation?: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth?: string;

  @Column({ length: 20, nullable: true })
  contact_phone_number?: string;

  @Column({ length: 6, nullable: true })
  gender?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ length: 25, nullable: true })
  address_number?: string;

  @Column({ length: 26, nullable: true })
  address_interior_number?: string;

  @Column({ type: 'text', nullable: true })
  address_complement?: string;

  @Column({ type: 'text', nullable: true })
  address_neighborhood?: string;

  @Column({ length: 10, nullable: true })
  address_zip_code?: string;

  @Column({ length: 100, nullable: true })
  address_city?: string;

  @Column({ length: 100, nullable: true })
  address_state?: string;

  @Column({ length: 24, nullable: true })
  role?: string;
}
