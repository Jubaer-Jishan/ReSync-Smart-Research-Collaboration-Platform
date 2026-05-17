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
import type { StorageService } from '../../storage/storage.interfaces';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_INPUT_PIXELS = 25_000_000;
const AVATAR_SIZE = 400;
const BANNER_WIDTH = 1600;
const BANNER_HEIGHT = 600;
const WEBP_QUALITY = 82;

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

export interface UploadUserMediaInput {
  fileBuffer: Buffer;
  fileSize: number;
  originalName?: string;
  contentType?: string;
}

export interface UploadUserMediaResult {
  key: string;
  url: string;
}

@Injectable()
export class UsersMediaService {
  constructor(
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
  ) {}

  async uploadAvatar(
    userId: string,
    input: UploadUserMediaInput,
  ): Promise<UploadUserMediaResult> {
    const optimized = await this.validateAndOptimize(input, 'avatar');
    return this.uploadToStorage(userId, 'avatar', optimized);
  }

  async uploadBanner(
    userId: string,
    input: UploadUserMediaInput,
  ): Promise<UploadUserMediaResult> {
    const optimized = await this.validateAndOptimize(input, 'banner');
    return this.uploadToStorage(userId, 'banner', optimized);
  }

  private async validateAndOptimize(
    input: UploadUserMediaInput,
    kind: 'avatar' | 'banner',
  ): Promise<Buffer> {
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

    try {
      const image = sharp(input.fileBuffer, {
        limitInputPixels: MAX_INPUT_PIXELS,
        failOnError: true,
      });
      const metadata = await image.metadata();

      if (metadata.pages && metadata.pages > 1) {
        throw new UnsupportedMediaTypeException('Animated images are not supported');
      }

      if (kind === 'avatar') {
        return await image
          .rotate()
          .resize({
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            fit: 'cover',
          })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer();
      }

      return await image
        .rotate()
        .resize({
          width: BANNER_WIDTH,
          height: BANNER_HEIGHT,
          fit: 'cover',
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

  private async uploadToStorage(
    userId: string,
    kind: 'avatar' | 'banner',
    optimizedBuffer: Buffer,
  ): Promise<UploadUserMediaResult> {
    const key = `users/${userId}/${kind}/${randomUUID()}.webp`;

    const uploadResult = await this.storageService.upload({
      key,
      body: optimizedBuffer,
      contentType: 'image/webp',
      contentLength: optimizedBuffer.length,
      cacheControl: 'public, max-age=31536000',
    });

    return {
      key: uploadResult.key,
      url: uploadResult.url,
    };
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
