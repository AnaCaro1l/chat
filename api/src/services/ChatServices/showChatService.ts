import io from '../../app';
import { AppError } from '../../errors/AppError';
import { Chat } from '../../models/Chat';

export const showChatService = async (id): Promise<Chat> => {
  const chat = await Chat.findByPk(id)

  if (!chat) {
    throw new AppError('Chat não encontrado');
  }

  io.to(`chat_${chat.id}`).emit('show_new_chat', chat);

  return chat;
};
