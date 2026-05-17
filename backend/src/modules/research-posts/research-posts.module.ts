import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../../storage/storage.module';
import { PostMedia } from './entities/post-media.entity';
import { PostResearchInterest } from './entities/post-research-interest.entity';
import { ResearchInterest } from './entities/research-interest.entity';
import { ResearchPost } from './entities/research-post.entity';
import { ResearchPostMediaService } from './research-post-media.service';
import { ResearchPostsController } from './research-posts.controller';
import { ResearchPostsService } from './research-posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResearchPost,
      PostMedia,
      ResearchInterest,
      PostResearchInterest,
    ]),
    StorageModule,
  ],
  controllers: [ResearchPostsController],
  providers: [ResearchPostMediaService, ResearchPostsService],
  exports: [TypeOrmModule, ResearchPostsService],
})
export class ResearchPostsModule {}
