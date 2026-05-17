import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { MediaFileType } from './enums/media-file-type.enum';
import { PostStatus } from './enums/post-status.enum';
import { PostMedia } from './entities/post-media.entity';
import { ResearchPost } from './entities/research-post.entity';
import { STORAGE_SERVICE } from '../../storage/storage.constants';
import { StorageService } from '../../storage/storage.interfaces';
import {
  ResearchPostMediaService,
  UploadPostMediaInput,
} from './research-post-media.service';

export interface CreatePostImageInput extends UploadPostMediaInput {}

export interface PaginatedPosts<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ResearchPostsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly mediaService: ResearchPostMediaService,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
    @InjectRepository(ResearchPost)
    private readonly postsRepository: Repository<ResearchPost>,
  ) {}

  async createPost(
    actorId: string,
    dto: CreatePostDto,
    images: CreatePostImageInput[] = [],
  ): Promise<ResearchPost> {
    // TODO: Add idempotency protection to prevent duplicate posts on retries.
    this.mediaService.validateFileCount(images.length);

    const postId = randomUUID();

    const uploads: { key: string; url: string }[] = [];
    try {
      for (const image of images) {
        const optimizedBuffer = await this.mediaService.validateAndOptimizeImage(image);
        const uploadResult = await this.mediaService.uploadOptimizedImage(postId, optimizedBuffer);
        uploads.push(uploadResult);
      }
    } catch (error) {
      await this.cleanupUploads(uploads);
      throw error;
    }

    try {
      return await this.dataSource.transaction(async (manager) => {
        const postRepo = manager.getRepository(ResearchPost);
        const mediaRepo = manager.getRepository(PostMedia);

        const post = postRepo.create({
          id: postId,
          ...dto,
          createdBy: { id: actorId },
        });

        const savedPost = await postRepo.save(post);

        if (uploads.length > 0) {
          const mediaEntities = uploads.map((upload) =>
            mediaRepo.create({
              post: savedPost,
              url: upload.url,
              storageKey: upload.key,
              type: MediaFileType.IMAGE,
            }),
          );

          await mediaRepo.save(mediaEntities);
        }

        return savedPost;
      });
    } catch (error) {
      await this.cleanupUploads(uploads);
      throw error;
    }
  }

  async getPosts(query: QueryPostDto): Promise<PaginatedPosts<ResearchPost>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.createdBy', 'creator')
      .leftJoinAndSelect(
        'post.media',
        'media',
        `media.id IN ${this.postsRepository
          .createQueryBuilder('mediaSub')
          .subQuery()
          .select('MIN(mediaSub.id)')
          .from(PostMedia, 'mediaSub')
          .where('mediaSub.postId = post.id')
          .getQuery()}`,
      )
      .distinct(true);

    if (query.researchDomain) {
      qb.andWhere('post.researchDomain = :researchDomain', {
        researchDomain: query.researchDomain,
      });
    }

    if (query.collaborationType) {
      qb.andWhere('post.collaborationType = :collaborationType', {
        collaborationType: query.collaborationType,
      });
    }

    if (query.academicLevel) {
      qb.andWhere('post.academicLevel = :academicLevel', {
        academicLevel: query.academicLevel,
      });
    }

    if (query.researchStage) {
      qb.andWhere('post.researchStage = :researchStage', {
        researchStage: query.researchStage,
      });
    }

    if (query.experienceLevel) {
      qb.andWhere('post.experienceLevel = :experienceLevel', {
        experienceLevel: query.experienceLevel,
      });
    }

    if (query.department) {
      qb.andWhere('post.department = :department', {
        department: query.department,
      });
    }

    if (query.deadlineFrom) {
      qb.andWhere('post.deadline >= :deadlineFrom', {
        deadlineFrom: query.deadlineFrom,
      });
    }

    if (query.deadlineTo) {
      qb.andWhere('post.deadline <= :deadlineTo', {
        deadlineTo: query.deadlineTo,
      });
    }

    if (query.q) {
      qb.andWhere(
        '(post.title ILIKE :search OR post.description ILIKE :search)',
        { search: `%${query.q}%` },
      );
    }

    qb.andWhere('post.status = :status', {
      status: query.status ?? PostStatus.OPEN,
    });

    const sortBy = this.resolveSortBy(query.sortBy);
    const sortOrder = this.resolveSortOrder(query.sortOrder);
    qb.orderBy(`post.${sortBy}`, sortOrder);

    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async getPostById(id: string): Promise<ResearchPost> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'media', 'interests', 'interests.interest'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async updatePost(
    id: string,
    actorId: string,
    dto: UpdatePostDto,
  ): Promise<ResearchPost> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.createdBy.id !== actorId) {
      throw new ForbiddenException('Only the post creator can update the post');
    }

    const updated = this.postsRepository.merge(post, dto);
    return this.postsRepository.save(updated);
  }

  async deletePost(id: string, actorId: string): Promise<{ success: true }> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'media'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.createdBy.id !== actorId) {
      throw new ForbiddenException('Only the post creator can delete the post');
    }

    const keys = post.media?.map((media) => media.storageKey) ?? [];

    if (keys.length > 0) {
      await this.deleteStorageKeys(keys);
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(ResearchPost).remove(post);
    });

    return { success: true };
  }

  private async cleanupUploads(uploads: { key: string }[]): Promise<void> {
    if (uploads.length === 0) {
      return;
    }

    // TODO: Add scheduled orphan cleanup job for failed deletions.
    await this.deleteStorageKeys(uploads.map((upload) => upload.key));
  }

  private async deleteStorageKeys(keys: string[]): Promise<void> {
    const errors: Error[] = [];

    await Promise.all(
      keys.map(async (key) => {
        try {
          await this.storageService.delete(key);
        } catch (error) {
          errors.push(error as Error);
        }
      }),
    );

    if (errors.length > 0) {
      throw new BadRequestException('Failed to delete one or more media files');
    }
  }

  private resolveSortBy(sortBy?: string): string {
    const allowed = new Set(['createdAt', 'deadline', 'updatedAt']);
    if (sortBy && allowed.has(sortBy)) {
      return sortBy;
    }

    return 'createdAt';
  }

  private resolveSortOrder(sortOrder?: string): 'ASC' | 'DESC' {
    if (!sortOrder) {
      return 'DESC';
    }

    const normalized = sortOrder.toUpperCase();
    return normalized === 'ASC' ? 'ASC' : 'DESC';
  }
}
