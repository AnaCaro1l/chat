import { AppError } from '../../errors/AppError';
import { Chat } from '../../models/Chat';
import { Message } from '../../models/Message';

interface Request {
  id: number;
  body?: string;
  userId: number;
}

export const updateMessageService = async ({
  id,
  body,
  userId,
}: Request): Promise<Message> => {
  const message = await Message.findByPk(id);
  const chat = await Chat.findOne({
    where: { id: message.chatId },
  });

  if (!message) {
    throw new AppError('Mensagem não encontrada');
  }

  if(message.fromUser !== userId) {
    throw new AppError('Você só pode editar suas próprias mensagens');
  }

  if (chat.lastMessage === message.body && message.fromUser === userId) {
    await chat.update({
      lastMessage: body,
    });
  }

  const updatedMessage = await message.update({
    body: body ? body : message.body,
  });

  return updatedMessage;
};
