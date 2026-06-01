import express, { Application } from 'express';
import cors from 'cors';
import { disconnectDatabase } from './config/database';
import { authRoutes } from './routes/auth.routes';
import { projectRoutes } from './routes/project.routes';
import { taskRoutes } from './routes/task.routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

// Puerto dinámico: Railway inyecta PORT automáticamente; 3000 es el fallback local
const PORT = Number(process.env.PORT) || 3000;

console.log(`[boot] GoPass API arrancando en puerto ${PORT}...`);
console.log(`[boot] NODE_ENV: ${process.env.NODE_ENV ?? 'development'}`);
console.log(`[boot] DATABASE_URL set: ${Boolean(process.env.DATABASE_URL)}`);
console.log(`[boot] JWT_SECRET set:   ${Boolean(process.env.JWT_SECRET)}`);

const app: Application = express();

// Parsear cuerpos JSON en todas las peticiones
app.use(express.json());

// CORS habilitado antes de cualquier ruta
// Permite el frontend local y el dominio de producción en Railway
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://projectgopass.up.railway.app',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (Postman, Railway health probes)
      if (!origin) return callback(null, true);
      // Permitir orígenes en la lista o cualquier subdominio .railway.app
      if (allowedOrigins.includes(origin) || origin.endsWith('.railway.app')) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);

// Ruta raíz — útil para verificar que el contenedor responde
app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'GoPass API' });
});

// Health check — Railway y herramientas de monitoreo llaman a este endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API running' });
});

// Rutas bajo prefijo /api — coincide con VITE_API_URL del frontend
app.use('/api/auth', authRoutes);       // POST /api/auth/login, /api/auth/register
app.use('/api/projects', projectRoutes); // CRUD de proyectos (requiere JWT)
app.use('/api/projects', taskRoutes);    // CRUD de tareas + sugerencias IA (requiere JWT)

// Middleware de errores global — debe ir al final, después de todas las rutas
app.use(errorHandler);

// Vinculamos a 0.0.0.0 para que el contenedor acepte tráfico externo
// Sin 0.0.0.0 el servidor solo escucha en localhost y Railway no puede alcanzarlo
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[boot] Servidor escuchando en http://0.0.0.0:${PORT}`);
});

// Cierre limpio al recibir señales del sistema operativo (Railway usa SIGTERM al detener)
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`[boot] Señal ${signal} recibida. Cerrando servidor...`);
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
};

process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => void gracefulShutdown('SIGINT'));

export default app;
