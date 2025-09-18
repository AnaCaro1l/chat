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
    lastMessage: body.length > 25 ? body.substring(0, 25) + '...' : body,
  });

  const message = await Message.create({
    body: body,
    chatId: chatId,
    fromUser: userId,
  });

  message.setDataValue('fromMe', true);

  io.to(`chat_${chatId}`).emit('message', message);
  io.to(`chat_${chatId}`).emit('last_message', chat.lastMessage);
  return message;
};
