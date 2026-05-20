import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamService } from './team.service';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async getMyTeams(@CurrentUser() user: { id: string }) {
    return this.teamService.getTeamsForUser(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async createTeam(@Body('name') name: string, @CurrentUser() user: { id: string }) {
    return this.teamService.createTeam(name, user.id);
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