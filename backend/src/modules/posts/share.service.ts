import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Share } from './entities/share.entity';
import { User } from '../users/entities/user.entity';
import { ResearchPost } from '../research-posts/entities/research-post.entity';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(Share)
    private readonly shareRepository: Repository<Share>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ResearchPost)
    private readonly postRepository: Repository<ResearchPost>,
  ) {}

  async sharePost(userId: string, postId: string): Promise<Share> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    const existing = await this.shareRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (existing) {
      throw new ConflictException('Post already shared.');
    }

    const share = this.shareRepository.create({ user, post });
    return this.shareRepository.save(share);
  }
}