import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from './entities/invitation.entity';
import { Team } from './entities/team.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async inviteToTeam(inviterId: string, inviteeId: string, teamId: string, message: string): Promise<Invitation> {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found.');
    }

    const inviter = await this.userRepository.findOne({ where: { id: inviterId } });
    if (!inviter) {
      throw new NotFoundException('Inviter not found.');
    }

    const invitee = await this.userRepository.findOne({ where: { id: inviteeId } });
    if (!invitee) {
      throw new NotFoundException('Invitee not found.');
    }

    const invitation = this.invitationRepository.create({
      inviter,
      invitee,
      team,
      message,
    });

    return this.invitationRepository.save(invitation);
  }
}