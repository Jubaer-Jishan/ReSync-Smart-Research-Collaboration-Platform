import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { InvitationService } from './invitation.service';
import { ApplicationController } from './application.controller';
import { InvitationController } from './invitation.controller';

@Module({
  controllers: [ApplicationController, InvitationController],
  providers: [ApplicationService, InvitationService],
  exports: [ApplicationService, InvitationService],
})
export class TeamModule {}
