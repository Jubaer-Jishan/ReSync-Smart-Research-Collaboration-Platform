import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateUserProfileDto } from '../../users/dto/create-user-profile.dto';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @IsString()
  @MaxLength(80)
  firstName: string;

  @IsString()
  @MaxLength(80)
  lastName: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserProfileDto)
  profile?: CreateUserProfileDto;
}
