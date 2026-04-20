import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import pool from './config/db.js';

// Load environment variables before anything else
dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT ?? '5000', 10);
const NODE_ENV: string = process.env.NODE_ENV ?? 'development';

app.use(helmet());

const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin "${origin}" is not allowed`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/issues', issueRoutes);

app.get('/health', async (_req: Request, res: Response): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({
      success: true,
      message: 'Database connection successful',
      env: NODE_ENV,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Database connection failed:', message);
    res.status(500).json({ success: false, message: 'Database connection failed', error: message });
  }
});

app.use((_req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: NODE_ENV === 'development' ? err.message : undefined,
  });
});

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} [${NODE_ENV}]`);
  console.log(`🗄️  Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});

const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Closing server…`);
  server.close(() => {
    pool.end().then(() => {
      console.log('Database pool closed. Goodbye.');
      process.exit(0);
    });
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
