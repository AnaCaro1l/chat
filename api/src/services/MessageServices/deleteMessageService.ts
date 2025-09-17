import { AppError } from '../../errors/AppError';
import { Chat } from '../../models/Chat';
import { Message } from '../../models/Message';

export const deleteMessageService = async (id): Promise<void> => {
  const message = await Message.findByPk(id);
  const chat = await Chat.findOne({
    where: { id: message.chatId },
  });

  if (!message) {
    throw new AppError('Mensagem não encontrada');
  }

  await message.destroy();

  if (chat.lastMessage === message.body) {
    const lastMessage = await Message.findOne({
      where: { chatId: chat.id },
      order: [['createdAt', 'DESC']],
    });
    await chat.update({
      lastMessage: lastMessage ? lastMessage.body : '',
    });
  }
};
