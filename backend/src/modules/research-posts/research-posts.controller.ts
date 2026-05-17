import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ResearchPostsService } from './research-posts.service';

const MAX_FILES = 4;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

@Controller('posts')
export class ResearchPostsController {
  constructor(private readonly postsService: ResearchPostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @UseInterceptors(
    FilesInterceptor('images', MAX_FILES, {
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
    }),
  )
  async create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreatePostDto,
    @UploadedFiles() files: Multer.File[] = [],
  ) {
    const images = (files ?? []).map((file) => ({
      fileBuffer: file.buffer,
      fileSize: file.size,
      originalName: file.originalname,
      contentType: file.mimetype,
    }));

    return this.postsService.createPost(user.id, dto, images);
  }

  @Get()
  getPosts(@Query() query: QueryPostDto) {
    return this.postsService.getPosts(query);
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  update(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  remove(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.postsService.deletePost(id, user.id);
  }
}
