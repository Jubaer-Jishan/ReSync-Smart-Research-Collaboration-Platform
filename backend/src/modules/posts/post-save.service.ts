import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ResearchPost } from '../research-posts/entities/research-post.entity';
import { SavedPost } from './entities/saved-post.entity';

@Injectable()
export class PostSaveService {
  constructor(
    @InjectRepository(SavedPost)
    private readonly savedPostRepository: Repository<SavedPost>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ResearchPost)
    private readonly postRepository: Repository<ResearchPost>,
  ) {}

  async savePost(userId: string, postId: string): Promise<SavedPost> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    const existing = await this.savedPostRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (existing) {
      throw new ConflictException('Post already saved.');
    }

    const savedPost = this.savedPostRepository.create({ user, post });
    return this.savedPostRepository.save(savedPost);
  }

  async unsavePost(userId: string, postId: string): Promise<{ success: true }> {
    const savedPost = await this.savedPostRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (!savedPost) {
      throw new NotFoundException('Saved post not found.');
    }

    await this.savedPostRepository.remove(savedPost);
    return { success: true };
  }

  async getSavedPosts(userId: string): Promise<ResearchPost[]> {
    const savedPosts = await this.savedPostRepository.find({
      where: { user: { id: userId } },
      relations: ['post', 'post.createdBy', 'post.media'],
      order: { createdAt: 'DESC' },
    });

    return savedPosts.map((savedPost) => savedPost.post);
  }
}