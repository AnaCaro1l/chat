import io from '../../app';
import { AppError } from '../../errors/AppError';
import { Chat } from '../../models/Chat';
import { Message } from '../../models/Message';

export const deleteMessageService = async (id): Promise<void> => {
  const message = await Message.findByPk(id);
  const chat = await Chat.findOne({
    where: { id: message?.chatId },
  });

  if (!message) {
    throw new AppError('Mensagem não encontrada');
  }

  await message.destroy();

  if (
    chat.lastMessage === message.body ||
    chat.lastMessage === message.body.substring(0, 30) + '...'
  ) {
    const lastMessage = await Message.findOne({
      where: { chatId: chat.id },
      order: [['createdAt', 'DESC']],
    });

    let newLastMessage = 'Nenhuma mensagem ainda...';

    if (lastMessage) {
      newLastMessage =
        lastMessage.body.length > 30
          ? lastMessage.body.substring(0, 30) + '...'
          : lastMessage.body;
    }

    await chat.update({
      lastMessage: newLastMessage,
    });

    io.to(`chat_${chat.id}`).emit('last_message', {
      chatId: chat.id,
      body: newLastMessage,
    });
  }
};
