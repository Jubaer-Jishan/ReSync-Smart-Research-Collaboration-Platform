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
    jwtSecret: process.env.JWT_SECRET ?? 'change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
  };
};
