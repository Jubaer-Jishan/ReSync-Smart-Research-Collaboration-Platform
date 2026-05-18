import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikeService } from './like.service';

@Controller('posts')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':postId/likes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  likePost(
    @Param('postId') postId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateLikeDto,
  ) {
    const targetPostId = dto.postId ?? postId;
    if (dto.postId && dto.postId !== postId) {
      throw new BadRequestException('Post id mismatch');
    }

    return this.likeService.likePost(user.id, targetPostId);
  }

  @Delete(':postId/likes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  unlikePost(
    @Param('postId') postId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.likeService.unlikePost(user.id, postId);
  }
}
