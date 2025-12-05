'use strict';

import FlowType from "../models/Enum/FlowEnum.js";
import { Sequelize } from 'sequelize';

export async function up(queryInterface, DataTypes) {
  await queryInterface.addColumn('Categories', 'flow', {
    type: Sequelize.ENUM(...FlowType.values()),
    allowNull: false,
    defaultValue: FlowType.EXPENSE,
  });
}

export async function down(queryInterface, DataTypes) {
  await queryInterface.removeColumn('Categories', 'flow');

  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS "enum_Categories_flow";'
  )
}
