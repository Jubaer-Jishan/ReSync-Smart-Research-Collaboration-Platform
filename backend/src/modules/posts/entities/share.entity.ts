import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ResearchPost } from '../../research-posts/entities/research-post.entity';

@Entity('shares')
export class Share {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => ResearchPost, (post) => post.shares, { onDelete: 'CASCADE' })
  post: ResearchPost;

  @CreateDateColumn()
  createdAt: Date;
}