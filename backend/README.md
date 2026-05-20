# ReSync Backend

Scalable NestJS backend for the ReSync research collaboration platform.

## Architecture

- Modular monolith with feature-based modules
- Clean layering per module (controllers, services, entities, DTOs)
- JWT authentication with RBAC guards
- DTO validation, pagination, and Swagger docs

## Tech Stack

- NestJS
- PostgreSQL + TypeORM
- JWT Auth + Passport
- Swagger

## Getting Started

1. Create a local env file

```bash
copy .env.example .env
```

2. Update `JWT_SECRET`, `JWT_REFRESH_SECRET`, and database values in `.env`
3. Start PostgreSQL
4. Run the API

```bash
npm run start:dev
```

Swagger UI is available at `/api/docs`.

## Environment Variables

- `NODE_ENV`
- `PORT`
- `DATABASE_URL` (recommended for Neon; when set, DB_* values are ignored)
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SSL`
- `DB_SYNCHRONIZE` (use `true` only in development)
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_REFRESH_SECRET`
- `JWT_REFRESH_EXPIRES_IN`

## Key Endpoints

Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

Users (JWT + RBAC)
- `GET /api/users`
- `GET /api/users/me`
- `GET /api/users/:id`
- `POST /api/users`

## Scripts

```bash
npm run start
npm run start:dev
npm run start:prod
npm run build
npm run test
npm run test:e2e
```
