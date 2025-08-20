import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';

// TRANSACTIONS
import transactionRoutes from './routes/transactionRoutes.js';

// MODELS
import User from './models/User.js';
import Transaction from './models/Transaction.js';

// Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

// Instance of Express.js
const app = express();

// Listen to this port
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// A simple test route to make sure the server is working.
app.get('/', (req, res) => {
  res.send('Money Tracker Backend is running!');
});

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes)

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Call the database functions and start the server.
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established!');

    await User.sync(
      process.env.NODE_ENV === 'development' 
        ? { force: true } 
        : { alter: true }
      );

    await Transaction.sync();
    console.log('Tables created successfully.');

    await User.findOrCreate({
      where: { id: '9046c827-023a-43c1-b0e2-628676d54d9c' },
      defaults: {
        username: 'default_user',
      }
    });

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