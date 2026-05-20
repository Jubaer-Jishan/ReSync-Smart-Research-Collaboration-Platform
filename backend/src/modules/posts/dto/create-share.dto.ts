import { IsOptional, IsUUID } from 'class-validator';

export class CreateShareDto {
  @IsOptional()
  @IsUUID()
  postId?: string;
}
