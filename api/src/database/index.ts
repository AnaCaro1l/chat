import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import { User } from "../models/User";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 3306,
    models: [User, Chat, Message]
})