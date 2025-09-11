'use strict';

import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up (queryInterface: QueryInterface) {
    return queryInterface.removeColumn('users', 'password');
  },

  down (queryInterface: QueryInterface) {
    return queryInterface.addColumn('users', 'password', {
      type: DataTypes.STRING,
      allowNull: false
    });
  }
};
