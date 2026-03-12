import express from 'express';
import cors from 'cors';
import todosRoutes from './routes/index.js';

export function createApp() {
  const app = express();
  app.use(cors({ origin: 'http://localhost:5173' }));
  app.use(express.json());
  app.use('/api/todos', todosRoutes);
  return app;
}
