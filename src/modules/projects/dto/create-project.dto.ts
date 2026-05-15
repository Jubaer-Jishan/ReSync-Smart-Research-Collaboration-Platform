import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VisibilityType } from '../../users/enums/visibility-type.enum';
import { ProjectStatus } from '../enums/project-status.enum';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  researchField!: string;

  @IsEnum(VisibilityType)
  @IsOptional()
  visibility?: VisibilityType;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;
}
