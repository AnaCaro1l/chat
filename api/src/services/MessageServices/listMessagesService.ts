import { Message } from '../../models/Message';

interface Request {
  chatId: string;
  userId: number;
}
export const listMessagesService = async ({
  chatId,
  userId,
}: Request): Promise<Message[]> => {
  const messages = await Message.findAll({
    where: {
      chatId: chatId,
    },
  });

  for (const message of messages) {
    message.setDataValue('fromMe', message.fromUser === userId);
  }

  return messages;
};
