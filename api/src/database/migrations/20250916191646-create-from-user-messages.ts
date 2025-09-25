'use strict';

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface) {
    return queryInterface.addColumn('Messages', 'fromUser', {
      type: DataTypes.INTEGER,
      allowNull: false
    })
  },

  async down (queryInterface: QueryInterface) {
    return queryInterface.removeColumn('Messages', 'fromUser')
  }
};
