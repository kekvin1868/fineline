import express from 'express';
import cors from 'cors';
import sequelize from './config/database';

// TRANSACTIONS
import transactionsRoute from './routes/transactionsRoute.js';

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
app.use('/api/transactions', transactionsRoute)

// Call the database functions and start the server.
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established!');

    await sequelize.sync();
    console.log('Tables created successfully!');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database: ', err);
    process.exit(1);
  }
}

startServer();