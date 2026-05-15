import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectMemberRoleDto } from './dto/update-project-member-role.dto';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(user.id, dto);
  }

  @Post(':id/members')
  addMember(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: AddProjectMemberDto,
  ) {
    return this.projectsService.addMember(user.id, id, dto);
  }

  @Patch(':id/members/role')
  updateMemberRole(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateProjectMemberRoleDto,
  ) {
    return this.projectsService.updateMemberRole(user.id, id, dto);
  }

  @Delete(':id/members/:userId')
  removeMember(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.projectsService.removeMember(user.id, id, userId);
  }

  @Delete(':id/leave')
  leaveProject(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ) {
    return this.projectsService.leaveProject(user.id, id);
  }
}
