import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/pagination/pagination.dto';
import { AcademicLevel } from '../enums/academic-level.enum';
import { CollaborationType } from '../enums/collaboration-type.enum';
import { ExperienceLevel } from '../enums/experience-level.enum';
import { PostStatus } from '../enums/post-status.enum';
import { ResearchDomain } from '../enums/research-domain.enum';
import { ResearchStage } from '../enums/research-stage.enum';
import { Department } from '../../users/enums/department.enum';

export class QueryPostDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ResearchDomain)
  researchDomain?: ResearchDomain;

  @IsOptional()
  @IsEnum(CollaborationType)
  collaborationType?: CollaborationType;

  @IsOptional()
  @IsEnum(Department)
  department?: Department;

  @IsOptional()
  @IsEnum(AcademicLevel)
  academicLevel?: AcademicLevel;

  @IsOptional()
  @IsEnum(ResearchStage)
  researchStage?: ResearchStage;

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: string;

  @IsOptional()
  @Type(() => Date)
  deadlineFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  deadlineTo?: Date;
}
