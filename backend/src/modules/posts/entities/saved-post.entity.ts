import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ResearchPost } from '../../research-posts/entities/research-post.entity';

@Entity('saved_posts')
@Unique(['user', 'post'])
export class SavedPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => ResearchPost, { onDelete: 'CASCADE' })
  post: ResearchPost;

  @CreateDateColumn()
  createdAt: Date;
}