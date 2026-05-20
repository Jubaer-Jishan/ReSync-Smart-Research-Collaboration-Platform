import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Team } from './team.entity';

@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  inviter: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  invitee: User;

  @ManyToOne(() => Team, { onDelete: 'CASCADE' })
  team: Team;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}