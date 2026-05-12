import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  institution?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
