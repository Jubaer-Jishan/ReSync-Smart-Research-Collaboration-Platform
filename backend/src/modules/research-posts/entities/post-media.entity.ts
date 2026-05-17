import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { MediaFileType } from '../enums/media-file-type.enum';
import { ResearchPost } from './research-post.entity';

@Entity('post_media')
export class PostMedia extends BaseEntity {
  @ManyToOne(() => ResearchPost, (post) => post.media, {
    onDelete: 'CASCADE',
  })
  @Index()
  post!: ResearchPost;

  @Column()
  url!: string;

  @Column()
  storageKey!: string;

  @Column({
    type: 'enum',
    enum: MediaFileType,
  })
  @Index()
  type!: MediaFileType;
}
