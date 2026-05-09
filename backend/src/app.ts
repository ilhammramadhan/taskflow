import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import tasksRouter from './routes/tasks';
import categoriesRouter from './routes/categories';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/auth', authRouter);
  app.use('/api/tasks', authMiddleware, tasksRouter);
  app.use('/api/categories', authMiddleware, categoriesRouter);

  app.use(errorHandler);

  return app;
}
