import User from './models/User.js';
import Transaction from './models/Transaction.js';
import Category from './models/Category.js';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { seedDefaultCategory } from './config/seed/seedCategories.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import session from 'express-session';

// Instance of Express.js
const app = express();

// Listen to this port
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));
app.use(cookieParser());

app.use(session({
  secret: process.env.AUTHENTIK_SECRET_KEY || 'asdf1234',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 10 * 60 * 1000 // 10 minutes
  }
}));

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes)
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// Swagger UI
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Call the database functions and start the server.
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established!');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`API docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('Unable to connect to the database: ', err);
    process.exit(1);
  }
}

startServer();
