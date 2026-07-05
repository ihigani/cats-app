# Cats Management API

NestJS backend for the Cats Management exercise.

## Stack

- NestJS with Fastify adapter
- PostgreSQL
- Sequelize ORM
- TypeScript

## Setup

1. Start PostgreSQL:

```bash
docker compose up -d
```

2. Configure environment:

```bash
cp .env.example .env
```

3. Install and run:

```bash
npm install
npm run start:dev
```

API runs at `http://localhost:3000`.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/cats` | List cats with pagination and filters (`page`, `limit`, `catName`, `mouseName`) |
| GET | `/cats/:id` | Get a single cat |
| POST | `/cats` | Create a cat |
| PATCH | `/cats/:id` | Update a cat |
| DELETE | `/cats/:id` | Delete a cat |

## Example

```bash
curl -X POST http://localhost:3000/cats \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Luna",
    "lastName": "Paws",
    "description": "A playful cat",
    "image": "https://placecats.com/300/200",
    "mice": [{ "name": "Jerry" }, { "name": "Stuart" }]
  }'
```
