export default () => {
  const dbUrl = process.env.DATABASE_URL ?? process.env.DB_URL ?? '';
  const hasDbUrl = dbUrl.length > 0;

  return {
  app: {
    env: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
  },
  database: {
    url: dbUrl,
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    name: process.env.DB_NAME ?? 'resync',
    ssl: process.env.DB_SSL ? process.env.DB_SSL === 'true' : hasDbUrl,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
    refreshJwtSecret:
      process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET,
    refreshJwtExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  email: {
    resendApiKey: process.env.RESEND_API_KEY,
    resendFrom: process.env.RESEND_FROM_EMAIL,
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER ?? 'r2',
    endpoint: process.env.STORAGE_ENDPOINT,
    region: process.env.STORAGE_REGION ?? 'auto',
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
    bucket: process.env.STORAGE_BUCKET,
    publicUrl: process.env.STORAGE_PUBLIC_URL,
    presignExpiresIn: parseInt(
      process.env.STORAGE_PRESIGN_EXPIRES_IN ?? '900',
      10,
    ),
    forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE === 'true',
  },
  };
};
