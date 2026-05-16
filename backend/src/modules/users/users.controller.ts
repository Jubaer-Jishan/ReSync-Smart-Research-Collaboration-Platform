import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Role } from "./enums/role.enum";
import { UpdateStudentProfileDto } from "./dto/update-student-profile.dto";
import { UpdateTeacherProfileDto } from "./dto/update-teacher-profile.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('bearer')
	getMe(@CurrentUser() user: { id: string }) {
		return this.usersService.getUserProfileById(user.id);
	}

	@Patch('me/profile')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('bearer')
	updateProfile(
		@CurrentUser() user: { id: string },
		@Body() dto: UpdateUserProfileDto,
	) {
		return this.usersService.updateUserProfile(user.id, dto);
	}

	@Patch('me/student-profile')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.STUDENT)
	@ApiBearerAuth('bearer')
	updateStudentProfile(
		@CurrentUser() user: { id: string },
		@Body() dto: UpdateStudentProfileDto,
	) {
		return this.usersService.upsertStudentProfile(user.id, dto);
	}

	@Patch('me/teacher-profile')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.TEACHER)
	@ApiBearerAuth('bearer')
	updateTeacherProfile(
		@CurrentUser() user: { id: string },
		@Body() dto: UpdateTeacherProfileDto,
	) {
		return this.usersService.upsertTeacherProfile(user.id, dto);
	}
}