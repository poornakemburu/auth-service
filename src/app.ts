import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import coachRoutes from './routes/coachRoutes';
dotenv.config();

const app: Application = express();

connectDB().catch(err => {
  console.error('Failed to connect to database', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('api/coaches', coachRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
