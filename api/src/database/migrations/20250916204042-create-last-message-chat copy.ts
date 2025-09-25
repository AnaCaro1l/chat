'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    async up(queryInterface) {
        return queryInterface.addColumn('Chats', 'lastMessage', {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        });
    },
    async down(queryInterface) {
        return queryInterface.removeColumn('Chats', 'lastMessage');
    }
};
