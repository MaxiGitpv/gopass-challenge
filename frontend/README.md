# GoPass Frontend

Cliente React para la prueba técnica de gestión de proyectos y tareas.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS (glassmorphism, paleta verde fintech)
- TanStack Query — estado asíncrono y cache
- Zustand — sesión de autenticación
- Axios — cliente HTTP con interceptores JWT
- React Router DOM — rutas protegidas
- Sonner — toasts de error/éxito
- Lucide React — iconografía

## Instalación

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

La app corre en `http://localhost:5173` y proxy `/api` → `http://localhost:3000`.

## Estructura

```
src/
├── api/           # Axios + interceptores
├── components/    # UI reutilizable
├── hooks/         # Wrappers de React Query
├── pages/         # Vistas principales
├── providers/     # QueryClient provider
├── router/        # Definición de rutas
├── store/         # Zustand auth
└── types/         # Tipos compartidos con el backend
```
