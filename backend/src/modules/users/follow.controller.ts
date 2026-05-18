import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FollowService } from './follow.service';
import { User } from './entities/user.entity';

@Controller('users/:id')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async followUser(
    @CurrentUser() currentUser: User,
    @Param('id') userId: string,
  ): Promise<void> {
    await this.followService.followUser(currentUser.id, userId);
  }

  @Delete('follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async unfollowUser(
    @CurrentUser() currentUser: User,
    @Param('id') userId: string,
  ): Promise<void> {
    await this.followService.unfollowUser(currentUser.id, userId);
  }

  @Get('followers')
  async getFollowers(@Param('id') userId: string): Promise<User[]> {
    return this.followService.getFollowers(userId);
  }

  @Get('following')
  async getFollowing(@Param('id') userId: string): Promise<User[]> {
    return this.followService.getFollowing(userId);
  }
}