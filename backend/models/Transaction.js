import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: -100000,
      max: 100000
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Uncategorized',
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

// Associations
User.hasMany(Transaction);
Transaction.belongsTo(User);

export default Transaction;