import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchPost } from '../research-posts/entities/research-post.entity';
import { User } from '../users/entities/user.entity';
import { CommentController } from './comment.controller';
import { LikeController } from './like.controller';
import { PostSaveController } from './post-save.controller';
import { PostSaveService } from './post-save.service';
import { ShareController } from './share.controller';
import { LikeService } from './like.service';
import { CommentService } from './comment.service';
import { ShareService } from './share.service';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { SavedPost } from './entities/saved-post.entity';
import { Share } from './entities/share.entity';
import { ResearchPostsModule } from '../research-posts/research-posts.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, SavedPost, Comment, Share, ResearchPost, User]),
    ResearchPostsModule,
    UsersModule,
  ],
  controllers: [
    PostSaveController,
    LikeController,
    CommentController,
    ShareController,
  ],
  providers: [PostSaveService, LikeService, CommentService, ShareService],
  exports: [LikeService, CommentService, ShareService],
})
export class PostModule {}
