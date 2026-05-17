import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { ResearchPostApplication } from './entities/research-post-application.entity';
import { ResearchPost } from '../research-posts/entities/research-post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResearchPostApplication, ResearchPost])],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [TypeOrmModule, ApplicationsService],
})
export class ApplicationsModule {}
