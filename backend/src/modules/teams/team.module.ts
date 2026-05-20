import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationService } from './application.service';
import { InvitationService } from './invitation.service';
import { ApplicationController } from './application.controller';
import { InvitationController } from './invitation.controller';
import { Team } from './entities/team.entity';
import { TeamMember } from './entities/team-member.entity';
import { Application } from './entities/application.entity';
import { Invitation } from './entities/invitation.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, TeamMember, Application, Invitation]),
    UsersModule,
  ],
  controllers: [ApplicationController, InvitationController],
  providers: [ApplicationService, InvitationService],
  exports: [ApplicationService, InvitationService, TypeOrmModule],
})
export class TeamModule {}
