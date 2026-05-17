import {
  Entity,
  ManyToOne,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ResearchInterest } from './research-interest.entity';
import { ResearchPost } from './research-post.entity';

@Entity('post_research_interests')
@Unique(['post', 'interest'])
export class PostResearchInterest extends BaseEntity {
  @ManyToOne(() => ResearchPost, (post) => post.interests, {
    onDelete: 'CASCADE',
  })
  post!: ResearchPost;

  @ManyToOne(() => ResearchInterest, { onDelete: 'CASCADE' })
  interest!: ResearchInterest;
}
