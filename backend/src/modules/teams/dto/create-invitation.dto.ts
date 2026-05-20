import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreateInvitationDto {
  @IsUUID()
  @IsNotEmpty()
  inviteeId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}