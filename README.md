# Cats Management App

Full-stack Cats Management application built for the Entitle developer exercise.

## Structure

- `backend/` – NestJS API (Fastify, PostgreSQL, Sequelize)
- `frontend/` – React app (Constate, Tailwind)

## Quick Start

1. Start PostgreSQL:

```bash
docker compose up -d
```

2. Start the backend:

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

3. Start the frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

- API: http://localhost:3000
- App: http://localhost:5173

## Submission

The exercise asks for two separate GitHub repositories. You can push `backend/` and `frontend/` as independent repos, or use git subtrees/submodules if preferred.
