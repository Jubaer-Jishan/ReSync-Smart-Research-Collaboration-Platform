import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { R2StorageService } from './r2-storage.service';
import { STORAGE_SERVICE } from './storage.constants';
import { StorageProvider, StorageService } from './storage.interfaces';

@Module({
  imports: [ConfigModule],
  providers: [
    R2StorageService,
    {
      provide: STORAGE_SERVICE,
      inject: [ConfigService, R2StorageService],
      useFactory: (
        configService: ConfigService,
        r2StorageService: R2StorageService,
      ): StorageService => {
        const provider = (configService.get<string>('storage.provider') ?? 'r2') as StorageProvider;

        if (provider === 'r2') {
          return r2StorageService;
        }

        throw new Error(`Storage provider not supported: ${provider}`);
      },
    },
  ],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
