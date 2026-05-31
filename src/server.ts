import express, { Application } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { disconnectDatabase } from './config/database';
import { authRoutes } from './routes/auth.routes';
import { projectRoutes } from './routes/project.routes';
import { taskRoutes } from './routes/task.routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

const app: Application = express();

app.use(express.json());

app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', taskRoutes);

app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${env.PORT}`);
});

const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`Señal ${signal} recibida. Cerrando servidor...`);
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
};

process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => void gracefulShutdown('SIGINT'));

export default app;
