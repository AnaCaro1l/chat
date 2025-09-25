'use strict';

import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface) {
    queryInterface.changeColumn('Chats', 'lastMessage', {
      type: DataType.TEXT,
      defaultValue: "",
      allowNull: false
    })
  },

  async down (queryInterface: QueryInterface) {
    queryInterface.changeColumn('Chats', 'lastMessage', {
      type: DataType.STRING,
      allowNull: true
    })
  }
};
