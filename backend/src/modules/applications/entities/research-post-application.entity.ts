import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { ResearchPost } from '../../research-posts/entities/research-post.entity';
import { ApplicationStatus } from '../enums/application-status.enum';

@Entity('research_post_applications')
@Unique(['post', 'user'])
export class ResearchPostApplication extends BaseEntity {
  @ManyToOne(() => ResearchPost, (post) => post.applications, {
    onDelete: 'CASCADE',
  })
  @Index()
  post!: ResearchPost;

  @ManyToOne(() => User, (user) => user.researchPostApplications, {
    onDelete: 'RESTRICT',
  })
  @Index()
  user!: User;

  @Column({ type: 'text' })
  message!: string;

  @Column({ nullable: true })
  portfolioLink?: string;

  @Column({ nullable: true })
  githubLink?: string;

  @Column({ type: 'text', nullable: true })
  researchExperience?: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  @Index()
  status!: ApplicationStatus;

  @Index()
  createdAt!: Date;
}
