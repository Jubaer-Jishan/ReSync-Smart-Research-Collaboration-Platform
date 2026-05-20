import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PostSaveService } from './post-save.service';

@Controller('posts/save')
export class PostSaveController {
  constructor(private readonly postSaveService: PostSaveService) {}

  @Post(':postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async savePost(
    @CurrentUser() user: { id: string },
    @Param('postId') postId: string,
  ) {
    return this.postSaveService.savePost(user.id, postId);
  }

  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async unsavePost(
    @CurrentUser() user: { id: string },
    @Param('postId') postId: string,
  ) {
    return this.postSaveService.unsavePost(user.id, postId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  getMySavedPosts(@CurrentUser() user: { id: string }) {
    return this.postSaveService.getSavedPosts(user.id);
  }
}