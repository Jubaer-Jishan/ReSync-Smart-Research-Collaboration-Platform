import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { RegisterDto } from "../auth/dto/register.dto";
import * as bcrypt from "bcrypt";
import { createHash } from 'crypto';
import { StudentProfile } from "./entities/student-profile.entity";
import { TeacherProfile } from "./entities/teacher-profile.entity";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";
import { SearchUsersDto } from "./dto/search-users.dto";
import { UpdateStudentProfileDto } from "./dto/update-student-profile.dto";
import { UpdateTeacherProfileDto } from "./dto/update-teacher-profile.dto";
import { Role } from "./enums/role.enum";
import { FollowService } from './follow.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(StudentProfile)
    private readonly studentProfilesRepository: Repository<StudentProfile>,
    @InjectRepository(TeacherProfile)
    private readonly teacherProfilesRepository: Repository<TeacherProfile>,
    private readonly followService: FollowService,
  ) {}

  async createUser(registerDto: RegisterDto): Promise<User> {
    const {
        username,
        email,
        password,
        confirmPassword,
    } = registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    // Check if the email is already registered

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException("Email is already registered");
    }

    const existingUsername = await this.usersRepository.findOne({ where: { username } });
    if (existingUsername) {
      throw new ConflictException("Username is already taken");
    }

    const hashedPassword = await bcrypt.hash(
        password,
        10,
    );

    //create new user

    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      name: registerDto.name,
      institution: registerDto.institution,
      department: registerDto.department,
      phoneNumber: registerDto.phoneNumber,
      role: registerDto.role,
    });

    //remove confirmPassword from user object before saving to database
    delete (user as any).confirmPassword;

    return await this.usersRepository.save(user);
  }

  //find user by email
  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
        where: { email }
    });
  }

  // find user by id
  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  async markEmailVerified(id: string): Promise<void> {
    await this.usersRepository.update({ id }, { isEmailVerified: true });
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(
      { id },
      {
        password: hashedPassword,
        passwordChangedAt: new Date(),
        refreshToken: null as unknown as string,
        refreshTokenRememberMe: false,
      },
    );
  }

  async setRefreshToken(
    id: string,
    refreshToken: string,
    rememberMe: boolean,
  ): Promise<void> {
    const hashedRefreshToken = this.hashToken(refreshToken);
    await this.usersRepository.update(
      { id },
      {
        refreshToken: hashedRefreshToken,
        refreshTokenRememberMe: rememberMe,
      },
    );
  }

  async clearRefreshToken(id: string): Promise<void> {
    await this.usersRepository.update(
      { id },
      {
        refreshToken: null as unknown as string,
        refreshTokenRememberMe: false,
      },
    );
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user?.refreshToken) {
      return null;
    }

    const hashedRefreshToken = this.hashToken(refreshToken);
    if (user.refreshToken !== hashedRefreshToken) {
      return null;
    }

    return user;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async updateUserProfile(userId: string, dto: UpdateUserProfileDto): Promise<Omit<User, 'password' | 'refreshToken' | 'refreshTokenRememberMe'>> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, dto);
    const saved = await this.usersRepository.save(user);
    await this.recomputeProfileCompletion(userId);

    const { password, refreshToken, refreshTokenRememberMe, ...safeUser } = saved;
    return safeUser;
  }

  async getUserProfileById(userId: string): Promise<Omit<User, 'password' | 'refreshToken' | 'refreshTokenRememberMe'>> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: {
        studentProfile: true,
        teacherProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, refreshToken, refreshTokenRememberMe, ...safeUser } = user;

    if (safeUser.role === Role.STUDENT) {
      delete (safeUser as Partial<User>).teacherProfile;
    } else if (safeUser.role === Role.TEACHER) {
      delete (safeUser as Partial<User>).studentProfile;
    } else {
      delete (safeUser as Partial<User>).studentProfile;
      delete (safeUser as Partial<User>).teacherProfile;
    }

    return safeUser;
  }

  async searchUsers(query: SearchUsersDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const normalizedQuery = typeof query.q === 'string' ? query.q.trim() : '';

    if (!normalizedQuery) {
      return { items: [], total: 0, page, limit };
    }

    const escapedQuery = normalizedQuery.replace(/[\\%_]/g, '\\$&').toLowerCase();
    const search = `%${escapedQuery}%`;

    try {
      const qb = this.usersRepository
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.name',
          'user.username',
          'user.profilePictureUrl',
          'user.bannerImage',
          'user.role',
          'user.department',
          'user.institution',
          'user.bio',
          'user.isProfileComplete',
        ])
        .where('user.isActive = true')
        .andWhere(
          `(
            LOWER(COALESCE(user.name, '')) LIKE :search ESCAPE '\\'
            OR LOWER(COALESCE(user.username, '')) LIKE :search ESCAPE '\\'
            OR LOWER(COALESCE(user.institution, '')) LIKE :search ESCAPE '\\'
            OR LOWER(COALESCE(CAST(user.department AS text), '')) LIKE :search ESCAPE '\\'
          )`,
          { search },
        )
        .orderBy('user.name', 'ASC');

      qb.skip((page - 1) * limit).take(limit);

      const [items, total] = await qb.getManyAndCount();
      return { items, total, page, limit };
    } catch {
      return { items: [], total: 0, page, limit };
    }
  }

  async upsertStudentProfile(userId: string, dto: UpdateStudentProfileDto): Promise<StudentProfile> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let profile = await this.studentProfilesRepository.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
    });

    if (!profile) {
      const institution = dto.institution ?? user.institution;
      const department = dto.department ?? user.department;
      const semester = dto.semester;

      if (!institution || !department || !semester) {
        throw new BadRequestException('Institution, department, and semester are required');
      }

      profile = this.studentProfilesRepository.create({
        ...dto,
        institution,
        department: String(department),
        semester,
        user,
      });

      const saved = await this.studentProfilesRepository.save(profile);
      await this.recomputeProfileCompletion(userId);
      return saved;
    }

    Object.assign(profile, dto);
    const saved = await this.studentProfilesRepository.save(profile);
    await this.recomputeProfileCompletion(userId);
    return saved;
  }

  async upsertTeacherProfile(userId: string, dto: UpdateTeacherProfileDto): Promise<TeacherProfile> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let profile = await this.teacherProfilesRepository.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
    });

    if (!profile) {
      const institution = dto.institution ?? user.institution;
      const department = dto.department ?? user.department;
      const designation = dto.designation;

      if (!institution || !department || !designation) {
        throw new BadRequestException('Institution, department, and designation are required');
      }

      profile = this.teacherProfilesRepository.create({
        ...dto,
        institution,
        department: String(department),
        designation,
        user,
      });

      const saved = await this.teacherProfilesRepository.save(profile);
      await this.recomputeProfileCompletion(userId);
      return saved;
    }

    Object.assign(profile, dto);
    const saved = await this.teacherProfilesRepository.save(profile);
    await this.recomputeProfileCompletion(userId);
    return saved;
  }

  private async recomputeProfileCompletion(userId: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: {
        studentProfile: true,
        teacherProfile: true,
      },
    });

    if (!user) {
      return;
    }

    const baseFieldsComplete = this.areUserProfileFieldsComplete(user);
    let roleFieldsComplete = true;

    if (user.role === Role.STUDENT) {
      roleFieldsComplete = this.areStudentProfileFieldsComplete(user.studentProfile);
    } else if (user.role === Role.TEACHER) {
      roleFieldsComplete = this.areTeacherProfileFieldsComplete(user.teacherProfile);
    }

    const isComplete = baseFieldsComplete && roleFieldsComplete;

    if (user.isProfileComplete !== isComplete) {
      await this.usersRepository.update({ id: userId }, { isProfileComplete: isComplete });
    }
  }

  private areUserProfileFieldsComplete(user: User): boolean {
    const requiredValues = [
      user.name,
      user.username,
      user.email,
      user.bio,
      user.profilePictureUrl,
      user.bannerImage,
      user.location,
      user.website,
      user.contactNumber,
      user.institution,
      user.department,
      user.phoneNumber,
      user.githubProfile,
      user.linkedinProfile,
      user.twitterProfile,
      user.facebookProfile,
      user.orcidProfile,
      user.googleScholarProfile,
      user.researchGateProfile,
    ];

    return requiredValues.every((value) => this.hasValue(value));
  }

  private areStudentProfileFieldsComplete(profile?: StudentProfile): boolean {
    if (!profile) {
      return false;
    }

    const requiredValues = [
      profile.institution,
      profile.department,
      profile.semester,
      profile.cgpa,
      profile.graduationYear,
      profile.skills,
      profile.interestedResearchFields,
    ];

    return requiredValues.every((value) => this.hasValue(value));
  }

  private areTeacherProfileFieldsComplete(profile?: TeacherProfile): boolean {
    if (!profile) {
      return false;
    }

    const requiredValues = [
      profile.institution,
      profile.department,
      profile.designation,
      profile.officeLocation,
      profile.yearsOfExperience,
      profile.specialization,
      profile.currentResearchArea,
      profile.googleScholarProfile,
      profile.researchGateProfile,
      profile.orcidId,
      profile.totalPublications,
      profile.hIndex,
    ];

    return requiredValues.every((value) => this.hasValue(value));
  }

  private hasValue(value: unknown): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    if (typeof value === 'number') {
      return Number.isFinite(value);
    }

    return true;
  }

  async getProfile(currentUserId: string, profileUserId: string) {
    const user = await this.usersRepository.findOne({ where: { id: profileUserId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const followersCount = await this.followService.getFollowers(profileUserId).then((f) => f.length);
    const followingCount = await this.followService.getFollowing(profileUserId).then((f) => f.length);
    const isFollowing = await this.followService
      .getFollowers(profileUserId)
      .then((followers) => followers.some((f) => f.id === currentUserId));

    return {
      user,
      followersCount,
      followingCount,
      isFollowing,
      isOwner: currentUserId === profileUserId,
    };
  }

  async getProfileByUsername(currentUserId: string, username: string) {
    const profileUser = await this.usersRepository.findOne({
      where: { username },
      relations: {
        studentProfile: true,
        teacherProfile: true,
      },
    });

    if (!profileUser) {
      throw new NotFoundException('User not found');
    }

    const safeUser = await this.getUserProfileById(profileUser.id);
    const followersCount = await this.followService
      .getFollowers(profileUser.id)
      .then((followers) => followers.length);
    const followingCount = await this.followService
      .getFollowing(profileUser.id)
      .then((following) => following.length);
    const isFollowing = await this.followService
      .getFollowers(profileUser.id)
      .then((followers) => followers.some((f) => f.id === currentUserId));

    return {
      user: safeUser,
      followersCount,
      followingCount,
      isFollowing,
      isOwner: currentUserId === profileUser.id,
    };
  }
}