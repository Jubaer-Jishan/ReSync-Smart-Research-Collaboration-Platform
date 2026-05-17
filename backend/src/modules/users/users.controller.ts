import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Patch,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Multer } from "multer";
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
import { UsersMediaService } from "./users-media.service";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly usersMediaService: UsersMediaService,
	) {}

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

	@Patch('me/avatar')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('bearer')
	@UseInterceptors(
		FileInterceptor('image', {
			limits: { fileSize: MAX_FILE_SIZE_BYTES },
		}),
	)
	async updateAvatar(
		@CurrentUser() user: { id: string },
		@UploadedFile() file?: Multer.File,
	) {
		if (!file) {
			throw new BadRequestException('Image file is required');
		}

		const upload = await this.usersMediaService.uploadAvatar(user.id, {
			fileBuffer: file.buffer,
			fileSize: file.size,
			originalName: file.originalname,
			contentType: file.mimetype,
		});

		return this.usersService.updateUserProfile(user.id, {
			profilePictureUrl: upload.url,
		});
	}

	@Patch('me/banner')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('bearer')
	@UseInterceptors(
		FileInterceptor('image', {
			limits: { fileSize: MAX_FILE_SIZE_BYTES },
		}),
	)
	async updateBanner(
		@CurrentUser() user: { id: string },
		@UploadedFile() file?: Multer.File,
	) {
		if (!file) {
			throw new BadRequestException('Image file is required');
		}

		const upload = await this.usersMediaService.uploadBanner(user.id, {
			fileBuffer: file.buffer,
			fileSize: file.size,
			originalName: file.originalname,
			contentType: file.mimetype,
		});

		return this.usersService.updateUserProfile(user.id, {
			bannerImage: upload.url,
		});
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