# Setup

## Prerequisites

- Node.js (LTS)
- PostgreSQL
- Redis

## Environment

Create a .env file (copy from .env.example if available) and set required values:

- JWT_SECRET (min 12 chars)
- JWT_EXPIRES_IN (default: 1d)
- REDIS_URL (required)
- RESEND_API_KEY (required)
- RESEND_FROM_EMAIL (required)

Database configuration (choose one):

- DATABASE_URL or DB_URL
- Or DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

## Install and run

npm install
npm run start:dev

Swagger UI: http://localhost:3000/api/docs
