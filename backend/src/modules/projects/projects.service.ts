import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectMemberRoleDto } from './dto/update-project-member-role.dto';
import { ProjectMember } from './entities/project-member.entity';
import { Project } from './entities/project.entity';
import { ProjectRole } from './enums/project-role.enum';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly membersRepository: Repository<ProjectMember>,
    private readonly usersService: UsersService,
  ) {}

  async createProject(ownerId: string, dto: CreateProjectDto): Promise<Project> {
    const user = await this.usersService.findById(ownerId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = this.projectsRepository.create(dto);
    const savedProject = await this.projectsRepository.save(project);

    const ownerMember = this.membersRepository.create({
      project: savedProject,
      user,
      role: ProjectRole.OWNER,
    });

    await this.membersRepository.save(ownerMember);

    return savedProject;
  }

  async addMember(
    actorId: string,
    projectId: string,
    dto: AddProjectMemberDto,
  ): Promise<ProjectMember> {
    const project = await this.getProjectOrThrow(projectId);
    await this.assertManagerRole(actorId, projectId);

    const user = await this.usersService.findById(dto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingMember = await this.membersRepository.findOne({
      where: { project: { id: projectId }, user: { id: dto.userId } },
    });

    if (existingMember) {
      throw new ConflictException('Member already exists');
    }

    const member = this.membersRepository.create({
      project,
      user,
      role: dto.role,
    });

    return this.membersRepository.save(member);
  }

  async updateMemberRole(
    actorId: string,
    projectId: string,
    dto: UpdateProjectMemberRoleDto,
  ): Promise<ProjectMember> {
    await this.getProjectOrThrow(projectId);
    await this.assertManagerRole(actorId, projectId);

    const member = await this.membersRepository.findOne({
      where: { project: { id: projectId }, user: { id: dto.userId } },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    member.role = dto.role;
    return this.membersRepository.save(member);
  }

  async removeMember(
    actorId: string,
    projectId: string,
    userId: string,
  ): Promise<{ success: true }> {
    await this.getProjectOrThrow(projectId);
    await this.assertManagerRole(actorId, projectId);

    const member = await this.membersRepository.findOne({
      where: { project: { id: projectId }, user: { id: userId } },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    await this.membersRepository.remove(member);
    return { success: true };
  }

  async leaveProject(
    actorId: string,
    projectId: string,
  ): Promise<{ success: true }> {
    await this.getProjectOrThrow(projectId);

    const member = await this.membersRepository.findOne({
      where: { project: { id: projectId }, user: { id: actorId } },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    await this.membersRepository.remove(member);
    return { success: true };
  }

  private async getProjectOrThrow(projectId: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  private async assertManagerRole(
    actorId: string,
    projectId: string,
  ): Promise<void> {
    const actorMembership = await this.membersRepository.findOne({
      where: { project: { id: projectId }, user: { id: actorId } },
    });

    if (
      !actorMembership ||
      (actorMembership.role !== ProjectRole.OWNER &&
        actorMembership.role !== ProjectRole.SUPERVISOR)
    ) {
      throw new ForbiddenException('Insufficient project role');
    }
  }
}
