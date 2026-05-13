import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudentProfile } from "./entities/student-profile.entity";
import { TeacherProfile } from "./entities/teacher-profile.entity";
import { User } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
	imports: [TypeOrmModule.forFeature([User, StudentProfile, TeacherProfile])],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}