import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Category from './Category.js';

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

// Associations USERS and TRANSACTIONS
User.hasMany(Transaction, { 
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
    allowNull: false
  }
});
Transaction.belongsTo(User, { 
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
    allowNull: false
  }
});

// Associations CATEGORIES and TRANSACTIONS
Transaction.belongsTo(Category, {
  foreignKey: {
    name: 'categoryId',
    type: DataTypes.UUID,
    allowNull: false
  },
});
Category.hasMany(Transaction, {
  foreignKey: {
    name: 'categoryId',
    type: DataTypes.UUID,
    allowNull: false
  },
});

export default Transaction;