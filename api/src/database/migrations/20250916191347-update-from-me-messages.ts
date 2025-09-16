'use strict';

import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  async up (queryInterface: QueryInterface) {
    return queryInterface.removeColumn('messages', 'fromMe')
  },

  async down (queryInterface: QueryInterface) {
    return queryInterface.addColumn('messages', 'fromMe', {
      type: DataTypes.BOOLEAN,
      allowNull: true
    })
  }
};
