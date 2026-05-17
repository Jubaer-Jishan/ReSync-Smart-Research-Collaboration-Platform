import { IsEnum, IsString } from 'class-validator';
import { MediaFileType } from '../enums/media-file-type.enum';

export class CreatePostMediaDto {
  @IsString()
  url!: string;

  @IsEnum(MediaFileType)
  type!: MediaFileType;
}
