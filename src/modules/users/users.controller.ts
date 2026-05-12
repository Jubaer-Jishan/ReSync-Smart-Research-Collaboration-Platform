import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PaginationQueryDto } from '../../common/pagination/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './enums/role.enum';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.usersService.findAll(pagination);
  }

  @Get('me')
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.RESEARCHER)
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    return this.usersService.findById(id);
  }
}
