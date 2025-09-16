import { Socket } from "socket.io";
import io from "../../app";
import { AppError } from "../../errors/AppError"
import { Chat } from "../../models/Chat"
import { Message } from "../../models/Message"

interface Request {
    body: string;
    chatId: number;
}

export const createMessageService = async({body, chatId}: Request): Promise<Message> => {
    
    const chat = await Chat.findByPk(chatId)

    if(!chat){
        throw new AppError('Chat não encontrado')
    }

    if(body === ""){
        throw new AppError('Digite algo para enviar')
    }
    const message = await Message.create({
        body: body,
        chatId: chatId,
        fromMe: true
    })
    
    io.emit('message', message.body)
    return message
}