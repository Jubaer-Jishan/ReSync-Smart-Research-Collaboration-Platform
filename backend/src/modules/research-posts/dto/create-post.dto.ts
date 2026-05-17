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

export class CreatePostDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title!: string;

  @IsString()
  @MinLength(30)
  description!: string;

  @IsEnum(ResearchDomain)
  researchDomain!: ResearchDomain;

  @IsEnum(CollaborationType)
  collaborationType!: CollaborationType;

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

  @IsInt()
  @Min(1)
  @Max(20)
  requiredCollaborators!: number;

  @IsEnum(Department)
  department!: Department;

  @IsEnum(AcademicLevel)
  academicLevel!: AcademicLevel;

  @IsEnum(ResearchStage)
  researchStage!: ResearchStage;

  @IsEnum(ExperienceLevel)
  experienceLevel!: ExperienceLevel;

  @Type(() => Date)
  @IsDate()
  @IsFutureDate()
  deadline!: Date;

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
