# gopass-challenge

Prueba técnica fullstack — gestión de proyectos y tareas con IA.

**Backend:** Node.js, Express, Prisma 7, PostgreSQL, TypeScript (Clean Architecture)  
**Frontend:** React, Vite, Tailwind CSS, TanStack Query, Zustand

## Requisitos

- Node.js 20+
- PostgreSQL en ejecución local

## Backend

```bash
npm install
cp .env.example .env   # Ajustar DATABASE_URL y OPENAI_API_KEY
npx prisma migrate dev --name init   # Solo la primera vez
npm run dev
```

API disponible en `http://localhost:3000`.

## Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App disponible en `http://localhost:5173` (proxy `/api` → backend).

## Endpoints API

| Método | Ruta | Auth |
|---|---|---|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET/POST | `/api/projects` | JWT |
| GET/PUT/DELETE | `/api/projects/:id` | JWT |
| GET/POST | `/api/projects/:projectId/tasks` | JWT |
| GET/PUT/DELETE | `/api/projects/:projectId/tasks/:taskId` | JWT |
| POST | `/api/projects/:projectId/tasks/suggestions` | JWT |

## Estructura

```
├── src/              # Backend (Express + Prisma)
├── frontend/src/     # Frontend (React + Vite)
├── prisma/           # Schema y migraciones
└── prisma.config.ts  # Configuración Prisma 7
```
