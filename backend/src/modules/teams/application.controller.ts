import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post(':teamId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  async applyToTeam(
    @Param('teamId') teamId: string,
    @CurrentUser() user: { id: string },
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    return this.applicationService.applyToTeam(
      user.id,
      teamId,
      createApplicationDto.message,
    );
  }
}