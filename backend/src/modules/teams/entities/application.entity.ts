import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Team } from './team.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  applicant: User;

  @ManyToOne(() => Team, { onDelete: 'CASCADE' })
  team: Team;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}