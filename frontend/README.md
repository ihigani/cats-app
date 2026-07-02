# Cats Management Frontend

React frontend for the Cats Management exercise.

## Stack

- React 18+
- TypeScript
- Constate (state management)
- Tailwind CSS
- React Router

## Setup

1. Configure environment:

```bash
cp .env.example .env
```

2. Install and run:

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

Make sure the backend API is running at `http://localhost:3000` (or update `VITE_API_BASE_URL`).

## Pages

- **Cats List** – view cats with mice, filter by cat/mouse name, paginate, edit, delete
- **Add / Edit Cat** – create, update, or delete a cat and manage its mice
