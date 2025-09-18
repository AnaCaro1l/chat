import io from '../../app';
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

  if (
    chat.lastMessage === message.body ||
    chat.lastMessage === message.body.substring(0, 25) + '...'
  ) {
    const lastMessage = await Message.findOne({
      where: { chatId: chat.id },
      order: [['createdAt', 'DESC']],
    });

    if (lastMessage.body.length > 25) {
      lastMessage.body = lastMessage.body.substring(0, 25) + '...';
    }

    await chat.update({
      lastMessage: lastMessage ? lastMessage.body : '',
    });
  }

  io.to(`chat_${chat.id}`).emit('last_message', chat.lastMessage);
};
