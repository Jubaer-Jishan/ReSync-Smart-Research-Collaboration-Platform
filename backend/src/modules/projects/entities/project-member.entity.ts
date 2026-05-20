import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ProjectRole } from '../enums/project-role.enum';
import { Project } from './project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('project_members')
@Unique(['project', 'user'])
export class ProjectMember extends BaseEntity {
  @ManyToOne(() => Project, (project) => project.members, { onDelete: 'CASCADE' })
  project!: Project;

  @ManyToOne(() => User, (user) => user.projectMemberships, { onDelete: 'CASCADE' })
  user!: User;

  @Column({
    type: 'enum',
    enum: ProjectRole,
    default: ProjectRole.CONTRIBUTOR,
  })
  role!: ProjectRole;
}
