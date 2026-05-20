import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateStudentProfileDto {
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
  @MaxLength(80)
  semester?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cgpa?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  graduationYear?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  skills?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  interestedResearchFields?: string;
}
