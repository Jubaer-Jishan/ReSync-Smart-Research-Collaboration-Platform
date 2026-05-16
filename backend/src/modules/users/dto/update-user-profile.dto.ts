import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Department } from '../enums/department.enum';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  profilePictureUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  bannerImage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  contactNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  institution?: string;

  @IsOptional()
  @IsEnum(Department)
  department?: Department;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  githubProfile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  linkedinProfile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  twitterProfile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  facebookProfile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  orcidProfile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  googleScholarProfile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  researchGateProfile?: string;
}
