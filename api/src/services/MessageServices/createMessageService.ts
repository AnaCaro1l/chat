import { Socket } from 'socket.io';
import io from '../../app';
import { AppError } from '../../errors/AppError';
import { Chat } from '../../models/Chat';
import { Message } from '../../models/Message';

interface Request {
  body: string;
  chatId: number;
  userId: number;
}

export const createMessageService = async ({
  body,
  chatId,
  userId,
}: Request): Promise<Message> => {
  const chat = await Chat.findByPk(chatId);

  if (!chat) {
    throw new AppError('Chat não encontrado');
  }

  if (body === '') {
    throw new AppError('Digite algo para enviar');
  }
  await chat.update({
    lastMessage: body,
  });

  const message = await Message.create({
    body: body,
    chatId: chatId,
    fromUser: userId,
  });
  message.setDataValue("fromMe", false)
  io.emit('message', message);
  return message;
};
