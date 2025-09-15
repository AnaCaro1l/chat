import { AppError } from '../../errors/AppError';
import { Chat } from '../../models/Chat';
import { User } from '../../models/User';
import { ChatSchema } from './schemas';

interface Request {
  ownerId: number;
  recipientId: number;
}

export const createChatService = async ({
  ownerId,
  recipientId,
}: Request): Promise<Chat> => {
  await ChatSchema.createChat.validate({ ownerId, recipientId });

  const userExists = await User.findByPk(ownerId);
  const recipientExists = await User.findByPk(recipientId);
  const chatExists = await Chat.findOne({
    where: { recipientId: recipientId },
  });

  if (ownerId === recipientId){
    throw new AppError('Você não pode criar um chat com você mesmo')
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

  const chat = await Chat.create({
    ownerId: ownerId,
    recipientId: recipientId,
  });

  return chat;
};
