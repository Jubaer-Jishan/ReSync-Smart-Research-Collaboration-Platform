import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { GroupsModule } from './modules/groups/groups.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { ResearchPostsModule } from './modules/research-posts/research-posts.module';
import { PostModule } from './modules/posts/post.module';
import { StorageModule } from './storage/storage.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    DatabaseModule,
    UsersModule,
    GroupsModule,
    AuthModule,
    ProjectsModule,
    ApplicationsModule,
    ResearchPostsModule,
    PostModule,
    StorageModule,
  ],
})
export class AppModule {}
