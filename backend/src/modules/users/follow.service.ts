import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from './entities/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async followUser(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself.');
    }

    const following = await this.userRepository.findOne({ where: { id: followingId } });
    if (!following) {
      throw new NotFoundException('User to follow not found.');
    }

    const existingFollow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (existingFollow) {
      throw new BadRequestException('You are already following this user.');
    }

    const follow = this.followRepository.create({
      follower: { id: followerId },
      following: { id: followingId },
    });

    await this.followRepository.save(follow);
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found.');
    }

    await this.followRepository.remove(follow);
  }

  async getFollowers(userId: string): Promise<User[]> {
    const followers = await this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });

    return followers.map((follow) => follow.follower);
  }

  async getFollowing(userId: string): Promise<User[]> {
    const following = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });

    return following.map((follow) => follow.following);
  }
}