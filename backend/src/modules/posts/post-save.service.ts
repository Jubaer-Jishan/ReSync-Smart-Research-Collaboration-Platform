import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ResearchPost } from '../research-posts/entities/research-post.entity';

@Injectable()
export class PostSaveService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ResearchPost)
    private readonly postRepository: Repository<ResearchPost>,
  ) {}

  async savePost(userId: string, postId: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    // Logic to save the post for the user
    return 'Post saved successfully';
  }
}