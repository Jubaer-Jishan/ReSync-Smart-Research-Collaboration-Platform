import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateShareDto } from './dto/create-share.dto';
import { ShareService } from './share.service';

@Controller('posts')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Post(':postId/shares')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  sharePost(
    @Param('postId') postId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateShareDto,
  ) {
    const targetPostId = dto.postId ?? postId;
    if (dto.postId && dto.postId !== postId) {
      throw new BadRequestException('Post id mismatch');
    }

    return this.shareService.sharePost(user.id, targetPostId);
  }
}
