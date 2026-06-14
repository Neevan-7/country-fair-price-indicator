import 'reflect-metadata';
import express, { Express, Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { AppDataSource } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { AppError } from './utils/AppError';
import priceRoutes from './controllers/priceController';
import userRoutes from './controllers/userController';
import authRoutes from './controllers/authController';
import locationRoutes from './controllers/locationController';
import reviewRoutes from './controllers/reviewController';
import logger from './utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(compression());
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
//   credentials: true,
//   optionsSuccessStatus: 200
// }));

app.use(cors({
  origin: [
    "http://localhost:3001",
    "https://country-fair-price-indicator.vercel.app"
  ],
  credentials: true
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging Middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));
app.use(requestLogger);

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/prices', priceRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/reviews', reviewRoutes);

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

// Global Error Handler
app.use(errorHandler);

// Initialize Database and Start Server
const initializeApp = async () => {
  try {
    // Initialize TypeORM Connection
    await AppDataSource.initialize();
    logger.info('Database connection established');

    // Start Server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`API URL: ${process.env.API_URL}`);
    });
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

// Graceful Shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  await AppDataSource.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  await AppDataSource.destroy();
  process.exit(0);
});

initializeApp();

export default app;
