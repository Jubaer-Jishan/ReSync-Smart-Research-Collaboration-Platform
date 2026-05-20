import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsUUID()
  @IsNotEmpty()
  applicantId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}