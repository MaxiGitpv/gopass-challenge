# GoPass Challenge

Prueba técnica fullstack — gestión de proyectos y tareas con IA.

**Backend:** Node.js · Express 5 · Prisma 7 · PostgreSQL · TypeScript  
**Frontend:** React 18 · Vite · Tailwind CSS · TanStack Query · Zustand

---

## Correr localmente

### Backend

```bash
npm install
cp .env.example .env      # Ajustar DATABASE_URL, JWT_SECRET y OPENAI_API_KEY
npx prisma migrate dev --name init
npm run dev               # http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env      # Dejar VITE_API_URL vacío en local (proxy Vite activo)
npm run dev               # http://localhost:5173
```

---

## Endpoints API

| Método | Ruta | Auth |
|---|---|---|
| POST | `/api/auth/register` | — |
| POST | `/api/auth/login` | — |
| GET · POST | `/api/projects` | JWT |
| GET · PUT · DELETE | `/api/projects/:id` | JWT |
| GET · POST | `/api/projects/:projectId/tasks` | JWT |
| GET · PUT · DELETE | `/api/projects/:projectId/tasks/:taskId` | JWT |
| POST | `/api/projects/:projectId/tasks/suggestions` | JWT |

---

## Despliegue en Railway

El monorepo se despliega como **dos servicios independientes** en Railway.

### Servicio 1 — API (Backend)

1. Crear nuevo servicio → **Deploy from GitHub repo** → seleccionar este repo
2. Railway detecta `railway.json` en la raíz y usa Nixpacks automáticamente
3. Configurar variables de entorno:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | URL del plugin PostgreSQL de Railway |
| `JWT_SECRET` | Cadena aleatoria larga (min 32 chars) |
| `JWT_EXPIRES_IN` | `1d` |
| `OPENAI_API_KEY` | Clave de la API de OpenAI |
| `PORT` | Railway lo inyecta automáticamente |

> El script `start` ejecuta `prisma migrate deploy` antes de arrancar el servidor, aplicando migraciones pendientes en cada deploy.

### Servicio 2 — Frontend (React)

1. Crear nuevo servicio → **Deploy from GitHub repo** → mismo repo
2. En el servicio, cambiar **Root Directory** a `frontend`
3. Railway detecta `frontend/railway.json` automáticamente
4. Configurar variables de entorno:

| Variable | Valor |
|---|---|
| `VITE_API_URL` | `https://<nombre-servicio-api>.up.railway.app/api` |

### Servicio 3 — PostgreSQL

1. En el proyecto Railway → **Add Plugin** → PostgreSQL
2. Copiar `DATABASE_URL` generado y pegarlo en las variables del servicio API

### Flujo de despliegue

```
GitHub push → Railway build
  Backend:  npm install → prisma generate → tsc
  Frontend: npm install → tsc → vite build

Railway deploy
  Backend:  prisma migrate deploy → node dist/server.js
  Frontend: serve -s dist
```

---

## Estructura del proyecto

```
gopass_challenge/
├── src/                  # Backend (Express + Prisma)
│   ├── config/           # env.ts, database.ts
│   ├── controllers/      # Capa HTTP
│   ├── middlewares/      # authenticate, errorHandler
│   ├── routes/           # auth, project, task
│   ├── services/         # Lógica de negocio + OpenAI
│   └── utils/            # jwt, bcrypt, params
├── frontend/src/         # Frontend (React + Vite)
│   ├── api/              # Funciones HTTP puras
│   ├── components/       # UI, layout, kanban
│   ├── hooks/            # React Query hooks
│   ├── pages/            # Login, Dashboard, Kanban
│   └── store/            # Zustand auth store
├── prisma/               # Schema y migraciones
├── railway.json          # Config Railway — Backend
└── frontend/railway.json # Config Railway — Frontend
```
