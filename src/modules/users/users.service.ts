import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/pagination/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/role.enum';
import { UserProfile } from './entities/user-profile.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(UserProfile) private readonly profilesRepo: Repository<UserProfile>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const user = this.usersRepo.create({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role ?? Role.RESEARCHER,
      isActive: true,
    });

    user.password = await bcrypt.hash(dto.password, 10);

    if (dto.profile) {
      user.profile = this.profilesRepo.create(dto.profile);
    }

    return this.usersRepo.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.firstName !== undefined) {
      user.firstName = dto.firstName;
    }

    if (dto.lastName !== undefined) {
      user.lastName = dto.lastName;
    }

    if (dto.role !== undefined) {
      user.role = dto.role;
    }

    if (dto.isActive !== undefined) {
      user.isActive = dto.isActive;
    }

    if (dto.profile) {
      user.profile = this.profilesRepo.create({
        ...user.profile,
        ...dto.profile,
      });
    }

    return this.usersRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(pagination: PaginationQueryDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const [data, total] = await this.usersRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
