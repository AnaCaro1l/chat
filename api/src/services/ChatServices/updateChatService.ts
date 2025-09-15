import { AppError } from '../../errors/AppError';
import { Chat } from '../../models/Chat';
import { User } from '../../models/User';
import { ChatSchema } from './schemas';

interface Request {
  ownerId: number;
  recipientId: number;
}

export const updateChatService = async (
  { ownerId, recipientId }: Request,
  id
): Promise<Chat> => {
  await ChatSchema.createChat.validate({ ownerId, recipientId });
  const chat = await Chat.findByPk(id);
  const userExists = await User.findByPk(ownerId);
  const recipientExists = await User.findByPk(recipientId);
  const chatExists = await Chat.findOne({
    where: { recipientId: recipientId },
  });
  if (ownerId === recipientId) {
    throw new AppError('Você não pode criar um chat com você mesmo');
  }

  if (!userExists) {
    throw new AppError('Remetente não encontrado');
  }

  if (!recipientExists) {
    throw new AppError('Destinatário não encontrado');
  }

  if (chatExists) {
    throw new AppError('Você já possui um chat com esse usuário');
  }

  const updatedChat = await chat.update({
    ownerId: ownerId ? ownerId : chat.ownerId,
    recipientId: recipientId ? recipientId : chat.recipientId,
    updatedAt: new Date(),
  });

  return updatedChat
};
