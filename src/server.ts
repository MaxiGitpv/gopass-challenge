import express, { Application } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { disconnectDatabase } from './config/database';
// Las rutas se registran aquí; cada módulo expone un Router de Express
import { authRoutes } from './routes/auth.routes';
import { projectRoutes } from './routes/project.routes';
import { taskRoutes } from './routes/task.routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

/**
 * Punto de entrada de la aplicación.
 * Responsabilidad única: ensamblar middlewares, montar rutas y arrancar el servidor.
 * La lógica de negocio vive en servicios; este archivo no la contiene.
 */
const app: Application = express();

// ---------------------------------------------------------------------------
// Middlewares globales — se aplican a todas las peticiones entrantes
// ---------------------------------------------------------------------------

// Permite parsear cuerpos JSON; límite estándar para payloads de API REST
app.use(express.json());

// Habilita peticiones cross-origin en desarrollo; ajustar en producción si hace falta
app.use(cors());

// ---------------------------------------------------------------------------
// Registro de rutas — cada prefijo agrupa un dominio del negocio
// ---------------------------------------------------------------------------

// Autenticación pública: registro y login (no requiere JWT)
app.use('/api/auth', authRoutes);

// Proyectos protegidos: el middleware JWT se aplica dentro del router
app.use('/api/projects', projectRoutes);

// Tareas anidadas bajo proyectos; incluye el endpoint de sugerencias IA
app.use('/api/projects', taskRoutes);

// ---------------------------------------------------------------------------
// Manejo centralizado de errores — debe ir al final del pipeline de Express
// ---------------------------------------------------------------------------
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Arranque del servidor y cierre limpio de la conexión a la base de datos
// ---------------------------------------------------------------------------
const server = app.listen(env.PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${env.PORT}`);
});

/** Cierra conexiones activas ante señales del sistema operativo */
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
