import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StorageModule } from "../../storage/storage.module";
import { StudentProfile } from "./entities/student-profile.entity";
import { TeacherProfile } from "./entities/teacher-profile.entity";
import { User } from "./entities/user.entity";
import { Follow } from "./entities/follow.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersMediaService } from "./users-media.service";
import { FollowService } from "./follow.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([User, StudentProfile, TeacherProfile, Follow]),
		StorageModule,
	],
	controllers: [UsersController],
	providers: [UsersService, UsersMediaService, FollowService],
	exports: [TypeOrmModule, UsersService, FollowService],
})
export class UsersModule {}