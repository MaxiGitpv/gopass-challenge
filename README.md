# gopass-challenge

Backend de prueba técnica — Node.js, Express, Prisma, PostgreSQL y TypeScript con Clean Architecture.

## Requisitos

- Node.js 18+
- PostgreSQL en ejecución local

## Instalación

```bash
npm install
cp .env.example .env   # Ajustar DATABASE_URL y OPENAI_API_KEY
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

El servidor queda disponible en `http://localhost:3000`.

## Endpoints

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
src/
├── config/        # Variables de entorno y Prisma
├── middlewares/   # JWT y manejo de errores
├── routes/        # Definición de endpoints
├── controllers/   # Extracción de req y respuesta HTTP
├── services/      # Lógica de negocio
└── utils/         # bcrypt, JWT
```
