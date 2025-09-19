import { Message } from '../../models/Message';

interface Request {
  chatId: string;
  userId: number;
  page: number;
  pageSize: number;
}
export const listMessagesService = async ({
  chatId,
  userId,
  page = 0,
  pageSize = 20
}: Request): Promise<Message[]> => {
  const offset = page * pageSize;
  const messages = await Message.findAll({
    where: {
      chatId: chatId,
    },
    order: [['createdAt', 'DESC']],
    limit: pageSize,
    offset,
  });

  for (const message of messages) {
    message.setDataValue('fromMe', message.fromUser === userId);
  }

  return messages;
};
