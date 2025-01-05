# URL Shortener API

A modern URL shortener service built with Node.js, Express, MongoDB, and Redis.

## Features

- Shorten long URLs
- Custom alias support
- QR code generation
- JWT authentication for protected endpoints
- Rate limiting
- Redis caching
- Swagger API documentation

## Prerequisites

- Node.js >= 20.11.0
- Docker and Docker Compose
- MongoDB Atlas account
- Redis

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd nodeTest
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
```env
REDIS_HOST=redis
REDIS_PORT=6379
MONGO_DB_URI=your_mongodb_uri
PORT=3000
BASE_URL=http://localhost:3000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRATION=86400
```

4. Run with Docker Compose:
```bash
docker-compose up -d
```

## API Endpoints

### Public Endpoints

- `POST /api/shorten` - Create a shortened URL
- `GET /:shortId` - Redirect to original URL
- `POST /api/token/get-token` - Get JWT token for protected endpoints

### Protected Endpoints (Requires JWT)

- `POST /api/shorten/:shortId/qr` - Generate QR code for shortened URL

## Documentation

API documentation is available at `/api-docs` when the server is running.

## Development

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run dev
```

## Production Deployment

The application is configured for deployment on Render.com using GitHub Actions CI/CD pipeline.

Required environment variables for deployment:
- `RENDER_API_KEY`
- `RENDER_DEPLOY_HOOK`
- Other environment variables as specified in `.env`

## License

MIT

## Author

Juan Manuel Conde Garcia