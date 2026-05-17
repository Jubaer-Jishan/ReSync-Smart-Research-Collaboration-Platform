import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { STORAGE_SERVICE } from '../../storage/storage.constants';
import { StorageService } from '../../storage/storage.interfaces';

const MAX_FILES_PER_POST = 4;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
const WEBP_QUALITY = 80;
const MAX_INPUT_PIXELS = 25_000_000;

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

export interface UploadPostMediaInput {
  fileBuffer: Buffer;
  fileSize: number;
  originalName?: string;
  contentType?: string;
}

export interface UploadPostMediaResult {
  key: string;
  url: string;
}

@Injectable()
export class ResearchPostMediaService {
  constructor(
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
  ) {}

  validateFileCount(count: number): void {
    if (count > MAX_FILES_PER_POST) {
      throw new BadRequestException('Post already has maximum media files');
    }
  }

  async validateAndOptimizeImage(input: UploadPostMediaInput): Promise<Buffer> {
    if (input.fileSize > MAX_FILE_SIZE_BYTES) {
      throw new PayloadTooLargeException('File exceeds 5MB limit');
    }

    const detectedMimeType = detectMimeType(input.fileBuffer);
    if (!detectedMimeType || !ALLOWED_MIME_TYPES.has(detectedMimeType)) {
      throw new UnsupportedMediaTypeException('Unsupported image type');
    }

    const normalizedContentType = normalizeContentType(input.contentType);
    if (
      normalizedContentType &&
      normalizedContentType !== normalizeContentType(detectedMimeType)
    ) {
      throw new UnsupportedMediaTypeException('File type mismatch');
    }

    return this.optimizeImage(input.fileBuffer);
  }

  async uploadOptimizedImage(
    postId: string,
    optimizedBuffer: Buffer,
  ): Promise<UploadPostMediaResult> {
    const key = `posts/${postId}/images/${randomUUID()}.webp`;

    // TODO: Add checksum/idempotency handling to prevent duplicate uploads on retries.
    const uploadResult = await this.storageService.upload({
      key,
      body: optimizedBuffer,
      contentType: 'image/webp',
      contentLength: optimizedBuffer.length,
      cacheControl: 'public, max-age=31536000',
    });

    return {
      key,
      url: uploadResult.url,
    };
  }

  private async optimizeImage(buffer: Buffer): Promise<Buffer> {
    try {
      const image = sharp(buffer, {
        limitInputPixels: MAX_INPUT_PIXELS,
        failOnError: true,
      });
      const metadata = await image.metadata();

      if (metadata.pages && metadata.pages > 1) {
        throw new UnsupportedMediaTypeException('Animated images are not supported');
      }

      return await image
        .rotate()
        .resize({
          width: MAX_WIDTH,
          height: MAX_HEIGHT,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
    } catch (error) {
      if (error instanceof UnsupportedMediaTypeException) {
        throw error;
      }

      throw new BadRequestException('Invalid or corrupted image file');
    }
  }
}

function detectMimeType(buffer: Buffer): string | null {
  if (buffer.length < 12) {
    return null;
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp';
  }

  return null;
}

function normalizeContentType(contentType?: string): string | null {
  if (!contentType) {
    return null;
  }

  const normalized = contentType.toLowerCase().trim();
  if (normalized === 'image/jpg') {
    return 'image/jpeg';
  }

  return normalized;
}
