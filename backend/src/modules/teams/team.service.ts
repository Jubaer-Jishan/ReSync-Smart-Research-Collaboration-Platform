import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { TeamMember } from './entities/team-member.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createTeam(name: string, ownerId: string): Promise<Team> {
    const existingTeam = await this.teamRepository.findOne({ where: { name } });
    if (existingTeam) {
      throw new BadRequestException('Team name already exists.');
    }

    const team = this.teamRepository.create({ name });
    const savedTeam = await this.teamRepository.save(team);

    const owner = await this.userRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new NotFoundException('Owner not found.');
    }

    const teamMember = this.teamMemberRepository.create({
      team: savedTeam,
      user: owner,
      role: 'OWNER',
    });

    await this.teamMemberRepository.save(teamMember);

    return savedTeam;
  }

  async getTeamsForUser(userId: string): Promise<Team[]> {
    const teamMembers = await this.teamMemberRepository.find({
      where: { user: { id: userId } },
      relations: { team: true },
      order: { createdAt: 'DESC' },
    });

    const teamIds = teamMembers
      .map((teamMember) => teamMember.team?.id)
      .filter((teamId): teamId is string => Boolean(teamId));

    if (teamIds.length === 0) {
      return [];
    }

    return this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.members', 'members')
      .leftJoinAndSelect('members.user', 'memberUser')
      .where('team.id IN (:...teamIds)', { teamIds })
      .orderBy('team.createdAt', 'DESC')
      .getMany();
  }

  async addMember(teamId: string, userId: string, role: string): Promise<void> {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found.');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const existingMember = await this.teamMemberRepository.findOne({
      where: { team: { id: teamId }, user: { id: userId } },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of the team.');
    }

    const teamMember = this.teamMemberRepository.create({
      team,
      user,
      role,
    });

    await this.teamMemberRepository.save(teamMember);
  }

  async removeMember(teamId: string, userId: string): Promise<void> {
    const teamMember = await this.teamMemberRepository.findOne({
      where: { team: { id: teamId }, user: { id: userId } },
    });

    if (!teamMember) {
      throw new NotFoundException('Team member not found.');
    }

    await this.teamMemberRepository.remove(teamMember);
  }

  async changeMemberRole(teamId: string, userId: string, newRole: string): Promise<void> {
    const teamMember = await this.teamMemberRepository.findOne({
      where: { team: { id: teamId }, user: { id: userId } },
    });

    if (!teamMember) {
      throw new NotFoundException('Team member not found.');
    }

    teamMember.role = newRole;
    await this.teamMemberRepository.save(teamMember);
  }

  async deleteTeam(teamId: string): Promise<void> {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found.');
    }

    await this.teamRepository.remove(team);
  }
}