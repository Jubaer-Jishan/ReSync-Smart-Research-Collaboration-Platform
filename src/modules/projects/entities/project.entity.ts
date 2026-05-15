import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { VisibilityType } from '../../users/enums/visibility-type.enum';
import { ProjectStatus } from '../enums/project-status.enum';
import { ProjectMember } from './project-member.entity';

@Entity('projects')
export class Project extends BaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  researchField!: string;

  @Column({
    type: 'enum',
    enum: VisibilityType,
    default: VisibilityType.PUBLIC,
  })
  visibility!: VisibilityType;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT,
  })
  status!: ProjectStatus;

  @OneToMany(() => ProjectMember, (member) => member.project, { cascade: true })
  members?: ProjectMember[];
}
