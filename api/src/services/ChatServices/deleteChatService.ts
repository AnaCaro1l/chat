import { AppError } from '../../errors/AppError';
import { Chat } from '../../models/Chat';

export const deleteChatService = async (id): Promise<void> => {
  const chat = await Chat.findByPk(id)

  if (!chat) {
    throw new AppError("Chat não encontrado")
  }

  await chat.destroy()
};
