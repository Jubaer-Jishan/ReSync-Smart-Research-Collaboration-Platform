import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Department } from '../../users/enums/department.enum';
import { User } from '../../users/entities/user.entity';
import { AcademicLevel } from '../enums/academic-level.enum';
import { CollaborationType } from '../enums/collaboration-type.enum';
import { ExperienceLevel } from '../enums/experience-level.enum';
import { PostStatus } from '../enums/post-status.enum';
import { ResearchDomain } from '../enums/research-domain.enum';
import { ResearchStage } from '../enums/research-stage.enum';
import { PostMedia } from './post-media.entity';
import { PostResearchInterest } from './post-research-interest.entity';
import { ResearchPostApplication } from '../../applications/entities/research-post-application.entity';
import { Like } from '../../posts/entities/like.entity';
import { Comment } from '../../posts/entities/comment.entity';
import { Share } from '../../posts/entities/share.entity';

@Entity('research_posts')
@Index(['status', 'deadline'])
@Index(['researchDomain', 'department'])
@Index(['createdAt'])
@Index(['status', 'createdAt'])
@Index(['researchDomain', 'createdAt'])
@Index(['collaborationType', 'createdAt'])
export class ResearchPost extends BaseEntity {
  @Column({ length: 100 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({
    type: 'enum',
    enum: ResearchDomain,
  })
  @Index()
  researchDomain!: ResearchDomain;

  @Column({
    type: 'enum',
    enum: CollaborationType,
  })
  @Index()
  collaborationType!: CollaborationType;

  // TODO: Consider normalizing into PostSkill/UserSkill tables when matching expands.
  @Column('text', { array: true, nullable: true })
  requiredSkills?: string[];

  // TODO: Consider normalizing into PostSkill/UserSkill tables when matching expands.
  @Column('text', { array: true, nullable: true })
  requiredRoles?: string[];

  @Column({ type: 'int' })
  requiredCollaborators!: number;

  @Column({ type: 'int', default: 0 })
  acceptedCount!: number;

  @Column({
    type: 'enum',
    enum: Department,
  })
  @Index()
  department!: Department;

  @Column({
    type: 'enum',
    enum: AcademicLevel,
  })
  academicLevel!: AcademicLevel;

  @Column({
    type: 'enum',
    enum: ResearchStage,
  })
  researchStage!: ResearchStage;

  @Column({
    type: 'enum',
    enum: ExperienceLevel,
  })
  experienceLevel!: ExperienceLevel;

  @Column({ type: 'timestamp' })
  @Index()
  deadline!: Date;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.OPEN,
  })
  @Index()
  status!: PostStatus;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @Index()
  createdBy!: User;

  @OneToMany(() => PostMedia, (media) => media.post, { cascade: true })
  media?: PostMedia[];

  @OneToMany(
    () => PostResearchInterest,
    (postInterest) => postInterest.post,
    { cascade: true },
  )
  interests?: PostResearchInterest[];

  @OneToMany(
    () => ResearchPostApplication,
    (application) => application.post,
  )
  applications?: ResearchPostApplication[];

  @OneToMany(() => Like, (like) => like.post)
  likes?: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments?: Comment[];

  @OneToMany(() => Share, (share) => share.post)
  shares?: Share[];
}
