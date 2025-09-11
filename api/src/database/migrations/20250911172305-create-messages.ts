'use strict';

import { DataTypes, QueryInterface } from "sequelize";


module.exports = {
  up (queryInterface: QueryInterface) {
    return queryInterface.createTable('Messages', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      fromMe: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      chatId: {
        type: DataTypes.INTEGER,
        references: { model: 'Chats', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    })
  },

  down (queryInterface: QueryInterface) {
    return queryInterface.dropTable('Messages')
  }
};
