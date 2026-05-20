import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@Controller('invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post(':teamId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async inviteToTeam(
    @Param('teamId') teamId: string,
    @CurrentUser() user: { id: string },
    @Body() createInvitationDto: CreateInvitationDto,
  ) {
    return this.invitationService.inviteToTeam(
      user.id,
      createInvitationDto.inviteeId,
      teamId,
      createInvitationDto.message,
    );
  }
}