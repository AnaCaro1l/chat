'use strict';

import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  async up (queryInterface: QueryInterface) {
    return queryInterface.removeColumn('Messages', 'fromMe')
  },

  async down (queryInterface: QueryInterface) {
    return queryInterface.addColumn('Messages', 'fromMe', {
      type: DataTypes.BOOLEAN,
      allowNull: true
    })
  }
};
