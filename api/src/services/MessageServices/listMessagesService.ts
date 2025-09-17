import { Op } from "sequelize"
import { Message } from "../../models/Message"
import { User } from "../../models/User"


export const listMessagesService = async(chatId, userId): Promise<Message[]> => {
    const messages = await Message.findAll({
        where: {
            chatId: chatId
        }
    })

    for (const message of messages) {
        message.dataValues.fromMe = message.fromUser === userId
    }

    return messages;
}