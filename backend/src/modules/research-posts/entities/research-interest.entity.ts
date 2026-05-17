import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('research_interests')
export class ResearchInterest extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @Column({ unique: true })
  slug!: string;
}
