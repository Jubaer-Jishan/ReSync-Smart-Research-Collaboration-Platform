import { Controller, Post, Body, Param } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@Controller('invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post(':teamId')
  async inviteToTeam(
    @Param('teamId') teamId: string,
    @Body() createInvitationDto: CreateInvitationDto,
  ) {
    return this.invitationService.inviteToTeam(
      createInvitationDto.inviterId,
      createInvitationDto.inviteeId,
      teamId,
      createInvitationDto.message,
    );
  }
}