import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostMedia } from './entities/post-media.entity';
import { PostResearchInterest } from './entities/post-research-interest.entity';
import { ResearchInterest } from './entities/research-interest.entity';
import { ResearchPost } from './entities/research-post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResearchPost,
      PostMedia,
      ResearchInterest,
      PostResearchInterest,
    ]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class ResearchPostsModule {}
