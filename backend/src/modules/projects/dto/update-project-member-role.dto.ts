import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ProjectRole } from '../enums/project-role.enum';

export class UpdateProjectMemberRoleDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(ProjectRole)
  role!: ProjectRole;
}
