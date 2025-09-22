'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    queryInterface.changeColumn('users', 'email', {
      type: DataTypes.STRING(100),
    });
  },

  async down(queryInterface: QueryInterface) {
    queryInterface.changeColumn('users', 'email', {
      type: DataTypes.STRING(40),
    });
  },
};
