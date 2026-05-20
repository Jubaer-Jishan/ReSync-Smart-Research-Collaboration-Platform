import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { User } from '../users/entities/user.entity';
import { ResearchPost } from '../research-posts/entities/research-post.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ResearchPost)
    private readonly postRepository: Repository<ResearchPost>,
  ) {}

  async likePost(userId: string, postId: string): Promise<Like> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    const existing = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (existing) {
      throw new ConflictException('Post already liked.');
    }

    const like = this.likeRepository.create({ user, post });
    return this.likeRepository.save(like);
  }

  async unlikePost(userId: string, postId: string): Promise<{ success: true }> {
    const like = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (!like) {
      throw new NotFoundException('Like not found.');
    }

    await this.likeRepository.remove(like);
    return { success: true };
  }

  async getLikedPosts(userId: string): Promise<ResearchPost[]> {
    const likes = await this.likeRepository.find({
      where: { user: { id: userId } },
      relations: ['post', 'post.createdBy', 'post.media'],
      order: { createdAt: 'DESC' },
    });

    return likes.map((like) => like.post);
  }
}