import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import { UserProfile } from './user-profile.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 80 })
  firstName: string;

  @Column({ type: 'varchar', length: 80 })
  lastName: string;

  @Column({ type: 'enum', enum: Role, default: Role.RESEARCHER })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  profile?: UserProfile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
