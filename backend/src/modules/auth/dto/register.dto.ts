import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  Matches,
  IsBoolean,
  IsOptional,
} from 'class-validator';

import { Role } from '../../users/enums/role.enum';
import { Department } from '../../users/enums/department.enum';

export class RegisterDto {

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  institution!: string;

  @IsEnum(Department)
  department!: Department;

  @IsString()
  @Matches(/^01\d{9}$/, {
    message: 'Phone number must be a valid Bangladeshi number',
  })
  phoneNumber!: string;

  @IsEnum(Role)
  role!: Role;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(8)
  confirmPassword!: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}