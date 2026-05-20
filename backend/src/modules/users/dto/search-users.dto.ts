import { IsString, MaxLength, MinLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/pagination/pagination.dto';

export class SearchUsersDto extends PaginationQueryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  q!: string;
}
