import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post(':teamId')
  async applyToTeam(
    @Param('teamId') teamId: string,
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    return this.applicationService.applyToTeam(
      createApplicationDto.applicantId,
      teamId,
      createApplicationDto.message,
    );
  }
}