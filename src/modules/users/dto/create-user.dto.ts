import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Role } from '../enums/role.enum';
import { CreateUserProfileDto } from './create-user-profile.dto';

export class CreateUserDto {
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
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserProfileDto)
  profile?: CreateUserProfileDto;
}
