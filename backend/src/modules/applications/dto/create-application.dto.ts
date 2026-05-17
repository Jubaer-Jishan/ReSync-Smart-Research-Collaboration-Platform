import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @MinLength(20)
  message!: string;

  @IsOptional()
  @IsUrl()
  portfolioLink?: string;

  @IsOptional()
  @IsUrl()
  githubLink?: string;

  @IsOptional()
  @IsString()
  researchExperience?: string;
}
