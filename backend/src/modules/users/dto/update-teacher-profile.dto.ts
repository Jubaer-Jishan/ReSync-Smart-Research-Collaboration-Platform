import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTeacherProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  institution?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  department?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  designation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  officeLocation?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  yearsOfExperience?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  specialization?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  currentResearchArea?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  googleScholarProfile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  researchGateProfile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  orcidId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalPublications?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  hIndex?: number;
}
