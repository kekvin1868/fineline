import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50],
      notEmpty: true,
    }
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Associations
User.hasMany(Category, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
    allowNull: false
  }
});

Category.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
    allowNull: false
  }
});

export default Category;