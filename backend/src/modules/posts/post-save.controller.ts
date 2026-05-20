import { Controller, Post, Body } from '@nestjs/common';
import { PostSaveService } from './post-save.service';

@Controller('posts/save')
export class PostSaveController {
  constructor(private readonly postSaveService: PostSaveService) {}

  @Post()
  async savePost(
    @Body('userId') userId: string,
    @Body('postId') postId: string,
  ) {
    return this.postSaveService.savePost(userId, postId);
  }
}