import {
  Controller,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamService } from './team.service';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async createTeam(@Body('name') name: string, @Body('ownerId') ownerId: string) {
    return this.teamService.createTeam(name, ownerId);
  }

  @Post(':id/members')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async addMember(
    @Param('id') teamId: string,
    @Body('userId') userId: string,
    @Body('role') role: string,
  ) {
    await this.teamService.addMember(teamId, userId, role);
  }

  @Delete(':id/members/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async removeMember(@Param('id') teamId: string, @Param('userId') userId: string) {
    await this.teamService.removeMember(teamId, userId);
  }

  @Patch(':id/members/:userId/role')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async changeMemberRole(
    @Param('id') teamId: string,
    @Param('userId') userId: string,
    @Body('role') newRole: string,
  ) {
    await this.teamService.changeMemberRole(teamId, userId, newRole);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async deleteTeam(@Param('id') teamId: string) {
    await this.teamService.deleteTeam(teamId);
  }
}