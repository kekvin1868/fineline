import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Sequelize instance to connect to the database.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false,
  }
);

// Export the Sequelize instance so it can be used in other files.
export default sequelize;