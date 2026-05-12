import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('database.url');
        const sslEnabled = config.get<boolean>('database.ssl');

        return {
          type: 'postgres',
          url: url || undefined,
          host: url ? undefined : config.get<string>('database.host'),
          port: url ? undefined : config.get<number>('database.port'),
          username: url ? undefined : config.get<string>('database.user'),
          password: url ? undefined : config.get<string>('database.password'),
          database: url ? undefined : config.get<string>('database.name'),
          autoLoadEntities: true,
          synchronize: config.get<boolean>('database.synchronize'),
          ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
