import { AppError } from '../../errors/AppError';
import { Chat } from '../../models/Chat';

export const showChatService = async (id): Promise<Chat> => {
  const chat = await Chat.findByPk(id)

  if (!chat) {
    throw new AppError('Chat não encontrado');
  }

  return chat;
};
