import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import pool from './config/db.js';

// Load environment variables before anything else
dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT ?? '5000', 10);
const NODE_ENV: string = process.env.NODE_ENV ?? 'development';

// ─── CORS ─────────────────────────────────────────────────────────────────────

const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin "${origin}" is not allowed`));
      }
    },
    credentials: true,
  }),
);

// ─── Body parsing ─────────────────────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/auth', authRoutes);
app.use('/issues', issueRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────

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

// ─── 404 fallback ─────────────────────────────────────────────────────────────

app.use((_req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Start server ─────────────────────────────────────────────────────────────

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} [${NODE_ENV}]`);
  console.log(`🗄️  Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────

const shutdown = async (signal: string): Promise<void> => {
  console.log(`\n${signal} received. Closing server…`);
  server.close(async () => {
    await pool.end();
    console.log('Database pool closed. Goodbye.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
