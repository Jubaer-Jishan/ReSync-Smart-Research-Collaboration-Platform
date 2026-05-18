import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';

@Controller('posts')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':postId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  addComment(
    @Param('postId') postId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.addComment(user.id, postId, dto.content);
  }

  @Get(':postId/comments')
  getComments(@Param('postId') postId: string) {
    return this.commentService.getComments(postId);
  }
}
