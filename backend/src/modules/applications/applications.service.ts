import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationStatus } from './enums/application-status.enum';
import { ResearchPostApplication } from './entities/research-post-application.entity';
import { ResearchPost } from '../research-posts/entities/research-post.entity';
import { PostStatus } from '../research-posts/enums/post-status.enum';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ResearchPostApplication)
    private readonly applicationRepository: Repository<ResearchPostApplication>,
    @InjectRepository(ResearchPost)
    private readonly postRepository: Repository<ResearchPost>,
  ) {}

  async apply(
    postId: string,
    actorId: string,
    dto: CreateApplicationDto,
  ): Promise<ResearchPostApplication> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['createdBy'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.createdBy.id === actorId) {
      throw new ForbiddenException('Cannot apply to your own post');
    }

    if (post.status !== PostStatus.OPEN) {
      throw new BadRequestException('Applications are closed for this post');
    }

    const existing = await this.applicationRepository.findOne({
      where: { post: { id: postId }, user: { id: actorId } },
    });

    if (existing) {
      throw new ConflictException('Application already exists');
    }

    const application = this.applicationRepository.create({
      post: { id: postId },
      user: { id: actorId },
      message: dto.message,
      portfolioLink: dto.portfolioLink,
      githubLink: dto.githubLink,
      researchExperience: dto.researchExperience,
      status: ApplicationStatus.PENDING,
    });

    try {
      return await this.applicationRepository.save(application);
    } catch (error: unknown) {
      if (this.isUniqueConstraintViolation(error)) {
        throw new ConflictException('Application already exists');
      }

      throw error;
    }
  }

  async accept(
    postId: string,
    applicationId: string,
    actorId: string,
  ): Promise<ResearchPostApplication> {
    return this.dataSource.transaction(async (manager) => {
      const postRepo = manager.getRepository(ResearchPost);
      const applicationRepo = manager.getRepository(ResearchPostApplication);

      const post = await postRepo.findOne({
        where: { id: postId },
        relations: ['createdBy'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.createdBy.id !== actorId) {
        throw new ForbiddenException('Only the post owner can accept applications');
      }

      const application = await applicationRepo.findOne({
        where: { id: applicationId, post: { id: postId } },
        lock: { mode: 'pessimistic_write' },
      });

      if (!application) {
        throw new NotFoundException('Application not found');
      }

      if (post.status === PostStatus.FILLED) {
        throw new BadRequestException('Post is already filled');
      }

      if (post.acceptedCount >= post.requiredCollaborators) {
        throw new BadRequestException('Post already has enough collaborators');
      }

      if (application.status !== ApplicationStatus.PENDING) {
        throw new BadRequestException('Application is not pending');
      }

      application.status = ApplicationStatus.ACCEPTED;
      await applicationRepo.save(application);

      post.acceptedCount += 1;

      if (post.acceptedCount >= post.requiredCollaborators) {
        post.status = PostStatus.FILLED;
      }

      await postRepo.save(post);

      if (post.status === PostStatus.FILLED) {
        await applicationRepo.update(
          {
            post: { id: postId },
            status: ApplicationStatus.PENDING,
          },
          { status: ApplicationStatus.REJECTED },
        );
      }

      return application;
    });
  }

  async reject(
    postId: string,
    applicationId: string,
    actorId: string,
  ): Promise<ResearchPostApplication> {
    return this.dataSource.transaction(async (manager) => {
      const postRepo = manager.getRepository(ResearchPost);
      const applicationRepo = manager.getRepository(ResearchPostApplication);

      const post = await postRepo.findOne({
        where: { id: postId },
        relations: ['createdBy'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.createdBy.id !== actorId) {
        throw new ForbiddenException('Only the post owner can reject applications');
      }

      const application = await applicationRepo.findOne({
        where: { id: applicationId, post: { id: postId } },
        lock: { mode: 'pessimistic_write' },
      });

      if (!application) {
        throw new NotFoundException('Application not found');
      }

      if (application.status !== ApplicationStatus.PENDING) {
        throw new BadRequestException('Application is not pending');
      }

      application.status = ApplicationStatus.REJECTED;
      return applicationRepo.save(application);
    });
  }

  async getApplicationsForPost(
    postId: string,
    actorId: string,
  ): Promise<ResearchPostApplication[]> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['createdBy'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.createdBy.id !== actorId) {
      throw new ForbiddenException('Only the post owner can view applications');
    }

    return this.applicationRepository.find({
      where: { post: { id: postId } },
    });
  }

  private isUniqueConstraintViolation(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const maybeCode = (error as { code?: string }).code;
    return maybeCode === '23505';
  }
}
