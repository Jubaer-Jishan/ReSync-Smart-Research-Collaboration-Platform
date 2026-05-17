import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  StorageGetUrlOptions,
  StorageService,
  StorageUploadInput,
  StorageUploadResult,
} from './storage.interfaces';

@Injectable()
export class R2StorageService implements StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly presignExpiresIn: number;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.getOrThrow<string>('storage.endpoint');
    const region = this.configService.get<string>('storage.region') ?? 'auto';
    const accessKeyId = this.configService.getOrThrow<string>('storage.accessKeyId');
    const secretAccessKey = this.configService.getOrThrow<string>('storage.secretAccessKey');
    this.bucket = this.configService.getOrThrow<string>('storage.bucket');
    this.publicUrl = this.configService.getOrThrow<string>('storage.publicUrl');
    this.presignExpiresIn =
      this.configService.get<number>('storage.presignExpiresIn') ?? 900;

    this.client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle:
        this.configService.get<boolean>('storage.forcePathStyle') ?? true,
    });
  }

  async upload(input: StorageUploadInput): Promise<StorageUploadResult> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      ContentLength: input.contentLength,
      CacheControl: input.cacheControl,
      Metadata: input.metadata,
    });

    const result = await this.client.send(command);
    const url = this.buildUrl(input.key);

    return {
      key: input.key,
      url,
      eTag: result.ETag,
      size: input.contentLength,
    };
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.client.send(command);
  }

  async getUrl(options: StorageGetUrlOptions): Promise<string> {
    if (this.publicUrl) {
      return this.buildUrl(options.key);
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: options.key,
      ResponseContentDisposition: options.downloadName
        ? `attachment; filename="${options.downloadName}"`
        : undefined,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: options.expiresIn ?? this.presignExpiresIn,
    });
  }

  private buildUrl(key: string): string {
    return `${this.publicUrl.replace(/\/+$/, '')}/${key}`;
  }
}
