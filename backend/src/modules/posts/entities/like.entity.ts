import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ResearchPost } from '../../research-posts/entities/research-post.entity';

@Entity('likes')
@Unique(['user', 'post'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => ResearchPost, (post) => post.likes, { onDelete: 'CASCADE' })
  post: ResearchPost;

  @CreateDateColumn()
  createdAt: Date;
}