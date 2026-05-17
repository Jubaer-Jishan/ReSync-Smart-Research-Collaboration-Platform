import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { MediaFileType } from '../enums/media-file-type.enum';

export class CreatePostMediaDto {
  @IsString()
  url!: string;

  @IsOptional()
  @IsString()
  storageKey?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsEnum(MediaFileType)
  fileType!: MediaFileType;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sizeBytes?: number;

  @IsOptional()
  @IsString()
  originalName?: string;

  @IsOptional()
  @IsString()
  checksum?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
