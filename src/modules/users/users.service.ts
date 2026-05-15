import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { RegisterDto } from "../auth/dto/register.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
        ...registerDto,
        password: hashedPassword,
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
      { password: hashedPassword, passwordChangedAt: new Date() },
    );
  }
}