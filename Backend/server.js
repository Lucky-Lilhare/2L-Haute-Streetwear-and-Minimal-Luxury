import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Database connection
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import issueRoutes from './routes/issueRoutes.js';

// Middleware imports
import { notFound, errorHandler } from './middleware/error.js';

// Resolve directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // fallback to root if present

// Initialize Express
const app = express();

// Establish Database Connection
connectDB();

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Dev friendly: allow access
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-host-key'],
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Welcome & Health Route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    brand: '2L — Haute Streetwear & Minimal Luxury',
    service: 'REST API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      users: '/api/users',
      cart: '/api/cart',
      wishlist: '/api/wishlist',
      orders: '/api/orders',
      issues: '/api/issues',
    },
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const readyState = mongoose.connection.readyState;
  const isConnected = readyState === 1;

  res.status(200).json({
    status: 'healthy',
    database: {
      status: dbStateMap[readyState] || 'unknown',
      connected: isConnected,
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
    },
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

// Mount Resource Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/issues', issueRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Server Listener
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`[2L Server] Running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`[2L Server] Listening on http://localhost:${PORT}`);
  console.log(`[2L Server] API Endpoints ready at http://localhost:${PORT}/api`);
  console.log(`======================================================\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection Error]: ${err.message}`);
  // In production, server.close(() => process.exit(1));
});

export default app;
