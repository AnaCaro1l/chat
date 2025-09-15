import { AppError } from '../../errors/AppError';
import { Chat } from '../../models/Chat';
import { User } from '../../models/User';
import { ChatSchema } from './schemas';

interface Request {
  ownerId: number;
  email: string;
}

export const createChatService = async ({
  ownerId,
  email,
}: Request): Promise<Chat> => {
  await ChatSchema.createChat.validate({ ownerId, email });

  const user = await User.findByPk(ownerId);

  const recipient = await User.findOne({
    where: { email: email },
  });

  const recipientId = recipient.id;

  const chatExists = await Chat.findOne({
    where: { recipientId: recipientId },
  });

  if (ownerId === recipientId) {
    throw new AppError('Você não pode criar um chat com você mesmo');
  }

  if (!user) {
    throw new AppError('Remetente não encontrado');
  }

  if (!recipient) {
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
