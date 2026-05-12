import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_profiles' })
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  title?: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  institution?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  bio?: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  user: User;
}
