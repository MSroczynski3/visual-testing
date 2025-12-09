# Visual Testing - E-Commerce Demo

A minimal e-commerce demo application designed for Playwright visual testing experiments.

## Architecture Overview

```
visual-testing/
├── frontend/          # React + TypeScript (Vite)
├── backend/           # Node.js + Express + TypeScript
├── infra/             # SQL schemas, env templates, docs
└── docker-compose.yml # Container orchestration
```

### Tech Stack

- **Frontend:** React 18, TypeScript, Vite, React Router
- **Backend:** Node.js, Express, TypeScript
- **Database:** Supabase (PostgreSQL)
- **Container:** Docker, Docker Compose

## Pages

| Route | Description |
|-------|-------------|
| `/` | Product listing page |
| `/product/:id` | Product detail page |
| `/cart` | Shopping cart page |

## Features for Visual Testing

- Light/Dark theme toggle
- Success banner after adding items to cart
- Deterministic UI (no random data)
- ARIA-compliant components
- Responsive design

## Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account with database configured
- Docker (for containerized deployment)

## Database Setup

1. Create a new Supabase project
2. Run the schema migration in `infra/schema.sql`
3. Seed the database with `infra/seed.sql`

## Environment Variables

### Backend

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=4000
```

## Running Locally (without Docker)

### Backend

```bash
cd backend
npm install
npm run dev
```

Server runs at http://localhost:4000

**API Documentation:** http://localhost:4000/api-docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at http://localhost:3000

## Running with Docker Compose

1. Copy environment template:
   ```bash
   cp infra/.env.example .env
   ```

2. Edit `.env` with your Supabase credentials

3. Build and start containers:
   ```bash
   docker-compose up --build
   ```

4. Access the app:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - API Documentation: http://localhost:4000/api-docs

## API Documentation

This project uses Swagger/OpenAPI for interactive API documentation. Once the backend server is running, you can access:

- **Swagger UI:** http://localhost:4000/api-docs - Interactive API documentation where you can test endpoints
- **OpenAPI Spec:** http://localhost:4000/api-docs.json - Raw OpenAPI JSON specification

## Testability

This application is optimized for Playwright visual testing:

- All interactive elements have proper ARIA roles and labels
- No randomized content or dynamic timestamps in UI
- Deterministic placeholder images using seeded URLs
- Theme toggle provides predictable visual states
- Success notifications are dismissible and timed

## Development Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript checks

### Backend
- `npm run dev` - Start with hot reload
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
