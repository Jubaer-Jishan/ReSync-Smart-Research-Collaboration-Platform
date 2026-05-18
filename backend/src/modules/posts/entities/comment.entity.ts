import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ResearchPost } from '../../research-posts/entities/research-post.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => ResearchPost, (post) => post.comments, { onDelete: 'CASCADE' })
  post: ResearchPost;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}