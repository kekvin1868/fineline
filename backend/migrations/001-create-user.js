'use strict';

export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Users', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
}

export async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Users');
}
