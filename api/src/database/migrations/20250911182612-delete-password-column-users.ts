'use strict';

import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up (queryInterface: QueryInterface) {
    return queryInterface.removeColumn('Users', 'password');
  },

  down (queryInterface: QueryInterface) {
    return queryInterface.addColumn('Users', 'password', {
      type: DataTypes.STRING,
      allowNull: false
    });
  }
};
