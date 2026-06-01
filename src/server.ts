import express, { Application } from 'express';
import cors from 'cors';
import { disconnectDatabase } from './config/database';
import { authRoutes } from './routes/auth.routes';
import { projectRoutes } from './routes/project.routes';
import { taskRoutes } from './routes/task.routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

const PORT = Number(process.env.PORT) || 3000;

const app: Application = express();

app.use(express.json());

// Whitelist + subdominios *.railway.app en prod
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://projectgopass.up.railway.app',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
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

app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'GoPass API' });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', taskRoutes);

// Debe registrarse después de todas las rutas
app.use(errorHandler);

// Bind 0.0.0.0 — requerido en contenedores (Railway/Docker)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`Signal ${signal} received. Shutting down...`);
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
};

process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => void gracefulShutdown('SIGINT'));

export default app;
