import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { Team } from './entities/team.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async applyToTeam(applicantId: string, teamId: string, message: string): Promise<Application> {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found.');
    }

    const applicant = await this.userRepository.findOne({ where: { id: applicantId } });
    if (!applicant) {
      throw new NotFoundException('Applicant not found.');
    }

    const application = this.applicationRepository.create({
      applicant,
      team,
      message,
    });

    return this.applicationRepository.save(application);
  }
}