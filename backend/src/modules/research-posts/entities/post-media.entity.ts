import {
  Column,
  Entity,
  Index,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
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

  @Column({ nullable: true })
  storageKey?: string;

  @Column({ nullable: true })
  provider?: string;

  @Column({
    type: 'enum',
    enum: MediaFileType,
  })
  @Index()
  fileType!: MediaFileType;

  @Column({ nullable: true })
  mimeType?: string;

  @Column({ type: 'bigint', nullable: true })
  sizeBytes?: number;

  @Column({ nullable: true })
  originalName?: string;

  @Column({ nullable: true })
  checksum?: string;

  @Column({ type: 'int', default: 0 })
  displayOrder!: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  uploadedBy?: User;
}
