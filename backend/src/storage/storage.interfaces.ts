import { Readable } from 'node:stream';

export type StorageProvider = 'r2' | 's3' | 'azure';

export interface StorageUploadInput {
  key: string;
  body: Buffer | Uint8Array | Readable | string;
  contentType?: string;
  contentLength?: number;
  cacheControl?: string;
  metadata?: Record<string, string>;
}

export interface StorageUploadResult {
  key: string;
  url: string;
  eTag?: string;
  size?: number;
}

export interface StorageGetUrlOptions {
  key: string;
  expiresIn?: number;
  downloadName?: string;
}

export interface StorageService {
  upload(input: StorageUploadInput): Promise<StorageUploadResult>;
  delete(key: string): Promise<void>;
  getUrl(options: StorageGetUrlOptions): Promise<string>;
}
