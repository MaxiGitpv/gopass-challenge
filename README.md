# GoPass AI Task Manager - Senior FullStack Challenge

Aplicación FullStack desarrollada para la prueba técnica de GoPass, enfocada en la gestión de proyectos y tareas con integración de Inteligencia Artificial para la automatización de flujos de trabajo.

## 🚀 Stack Tecnológico

**Backend:** Node.js · Express 5 · Prisma 7 · PostgreSQL · TypeScript
**Frontend:** React 18 · Vite · Tailwind CSS · TanStack Query · Zustand

## 🏗️ Arquitectura y Patrones
- **Clean Architecture (Backend):** Separación estricta de responsabilidades (Rutas, Controladores, Servicios).
- **SOLID:** Código modular y testeable.
- **Seguridad:** Autenticación vía JWT (JSON Web Tokens) gestionada a través de middlewares en el backend e interceptores centralizados de Axios en el frontend. Encriptación de contraseñas con `bcrypt`.
- **Estado Frontend:** Separación del estado del servidor (React Query) y estado global del cliente (Zustand).

## 💻 Ejecución Local

### Backend
\`\`\`bash
npm install
cp .env.example .env      # Ajustar DATABASE_URL, JWT_SECRET y OPENAI_API_KEY
npx prisma migrate dev
npm run dev               # Escucha en http://localhost:3000
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
cp .env.example .env      # Dejar VITE_API_URL vacío para usar proxy local
npm run dev               # Escucha en http://localhost:5173
\`\`\`

## ☁️ Despliegue en Producción (Railway)
El proyecto está configurado como un **Monorepo** que despliega dos servicios independientes en Railway.

**Servicio 1: Backend (API)**
- **Root Directory:** `/` (Raíz del proyecto)
- **Build Command:** Automático vía `package.json` (`prisma generate && tsc && npx prisma migrate deploy`).
- **Variables de entorno necesarias:** `DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY`.

**Servicio 2: Frontend (Web)**
- **Root Directory:** `/frontend`
- **Build Command:** Automático (`npm run build`).
- **Start Command:** `serve -s dist -p $PORT` (Vía `package.json`).
- **Variables de entorno necesarias:** `VITE_API_URL` (Apuntando a la URL pública del backend).

## 📁 Estructura del Proyecto
\`\`\`text
gopass_challenge/
├── src/                  # Backend API
│   ├── controllers/      # Handlers HTTP
│   ├── middlewares/      # Interceptores (Auth, Errores)
│   ├── routes/           # Definición de Endpoints
│   └── services/         # Lógica de Negocio y Base de Datos (Prisma)
├── frontend/src/         # Frontend Web
│   ├── api/              # Cliente Axios
│   ├── components/       # UI Reutilizable (Kanban, Tarjetas)
│   ├── hooks/            # Mutaciones y Queries (React Query)
│   └── store/            # Auth Store (Zustand)
└── prisma/               # Esquema de base de datos
\`\`\`