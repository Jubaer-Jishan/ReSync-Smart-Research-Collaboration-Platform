import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ResearchPostApplication } from './entities/research-post-application.entity';
import { ApplicationsService } from './applications.service';

@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    @InjectRepository(ResearchPostApplication)
    private readonly applicationRepository: Repository<ResearchPostApplication>,
  ) {}

  @Post('posts/:id/apply')
  apply(
    @Param('id') postId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateApplicationDto,
  ) {
    return this.applicationsService.apply(postId, user.id, dto);
  }

  @Patch('applications/:id/accept')
  async accept(
    @Param('id') applicationId: string,
    @CurrentUser() user: { id: string },
  ) {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['post'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return this.applicationsService.accept(
      application.post.id,
      applicationId,
      user.id,
    );
  }

  @Patch('applications/:id/reject')
  async reject(
    @Param('id') applicationId: string,
    @CurrentUser() user: { id: string },
  ) {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['post'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return this.applicationsService.reject(
      application.post.id,
      applicationId,
      user.id,
    );
  }

  @Get('posts/:id/applications')
  getApplications(
    @Param('id') postId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.applicationsService.getApplicationsForPost(postId, user.id);
  }
}
