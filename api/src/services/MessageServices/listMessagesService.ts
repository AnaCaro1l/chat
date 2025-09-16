import { Op } from "sequelize"
import { Chat } from "../../models/Chat"
import { Message } from "../../models/Message"


export const listMessagesService = async(messageId: string, id): Promise<Message[]> => {
    const message = await Message.findByPk(messageId)
    const chat = await Chat.findOne({
        where: {
            [Op.or]: [
                {ownerId: id},
                {recipientId: id}
            ]
        }
    })

    if (chat.recipientId === id){
        await message.update({
            fromMe: false
        })
    }

    const messages = await Message.findAll({
        where: {chatId: chat.id}
    })

    return messages

}