import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import 'express-async-errors';

// Import routes
import authRoutes from './routes/auth';
import farmsRoutes from './routes/farms';
import cropsRoutes from './routes/crops';
import livestockRoutes from './routes/livestock';
import workersRoutes from './routes/workers';
import financeRoutes from './routes/finance';
import diseaseRoutes from './routes/disease';
import forageRoutes from './routes/forage';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Express = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: '🌾 Smart Farm Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      farms: '/api/farms',
      crops: '/api/crops',
      livestock: '/api/livestock',
      workers: '/api/workers',
      finance: '/api/finance',
      disease: '/api/disease',
      forage: '/api/forage',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmsRoutes);
app.use('/api/crops', cropsRoutes);
app.use('/api/livestock', livestockRoutes);
app.use('/api/workers', workersRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/forage', forageRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation available at http://localhost:${PORT}/api`);
  console.log(`✅ Database connected`);
});

export { app, io };
