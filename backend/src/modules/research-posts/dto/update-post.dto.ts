import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Department } from '../../users/enums/department.enum';
import { AcademicLevel } from '../enums/academic-level.enum';
import { CollaborationType } from '../enums/collaboration-type.enum';
import { ExperienceLevel } from '../enums/experience-level.enum';
import { PostStatus } from '../enums/post-status.enum';
import { ResearchDomain } from '../enums/research-domain.enum';
import { ResearchStage } from '../enums/research-stage.enum';
import { CreatePostMediaDto } from './create-post-media.dto';
import { IsFutureDate } from './validators/future-date.decorator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(30)
  description?: string;

  @IsOptional()
  @IsEnum(ResearchDomain)
  researchDomain?: ResearchDomain;

  @IsOptional()
  @IsEnum(CollaborationType)
  collaborationType?: CollaborationType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  requiredSkills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  requiredRoles?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  requiredCollaborators?: number;

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
  @Type(() => Date)
  @IsDate()
  @IsFutureDate()
  deadline?: Date;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => CreatePostMediaDto)
  media?: CreatePostMediaDto[];
}
